<script>

import { fabric } from 'fabric' 

fabric.Object.prototype.cornerColor = '#07a5db';
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.cornerSize = 18;
fabric.Object.prototype.transparentCorners = false;

import {mapGetters} from 'vuex'

export default {
	data: () => ({
		croppingCanvas: null,
		showDialog: true,
		croppingImg:null,
		maxScaleX:0,
		maxScaleY:0,
		clipWidth:0,
		clipHeight:0,
		timeout: null,
		zoom: 1,
		minZoom: 1,
		maxZoom: 20,
	}),
	computed:{
		canvas(){
			if( process.client ){
				return window.canvas
			}
		},
		windowHeight(){
			if( process.client ){
				return window.innerHeight
			}
		},
		...mapGetters({
			croppingObjectId: 'estudio/main/croppingObjectId',
		})
	},
	mounted() {
		var obj = window.canvas.getObjects().find( o => o.id == this.croppingObjectId)
		// this.$set(this, 'croppingImg', obj)

		setTimeout(() => {
			this.setupCroppingCanvas().then(() => {
				this.setupBackground()
			})
			.then(() => {
				this.setupClippingObjects()
			}).then( () => {
				this.setupCroppingImage(obj.getSrc())
				

				this.$watch('clipWidth', (value) => {
					clearTimeout(this.timeout)
					this.timeout = setTimeout( () => {
						var ao = this.croppingCanvas.getActiveObject()
						ao.set('width',value / ao.scaleX)
						ao.setCoords()
						this.croppingCanvas.renderAll()
						this.timeout = null
					}, 150)
				})

				this.$watch('clipHeight', (value) => {
					clearTimeout(this.timeout)
					this.timeout = setTimeout( () => {
						var ao = this.croppingCanvas.getActiveObject()
						ao.set('height',value / ao.scaleY)
						ao.setCoords()
						this.croppingCanvas.renderAll()
						this.timeout = null
					}, 150)
				})
			})
		}, 400)
	},
	beforeDestroy(){
		this.croppingCanvas.dispose()
	},
	methods: {
		setupCroppingCanvas() {
			return new Promise((resolve) => {
				var canvas
				var height
				const wH = window.innerHeight
				
				if(this.$breakpoints.width > wH){
					height = wH * 0.85

				} else {
					var cch = document.getElementsByClassName('crop-controls')[0].clientHeight
					height = wH - cch - 160
				}


				var width = document.getElementById('cropCanvasWrapper').clientWidth
				canvas = new fabric.Canvas(document.getElementById('maskCanvas'), {
					controlsAboveOverlay: true,
					// perPixelTargetFind: true,
					selectionColor: '#FF000033',
					selectionBorderColor: '#ff6600FF',
				})

				canvas.setDimensions({
					width,
					height,
				})

				canvas.renderAll()
				this.croppingCanvas = canvas
				canvas.on('selection:cleared', () => {
					var clipPath = canvas.getObjects().find( o => o.id == 'clipPath')
					canvas.setActiveObject(clipPath)
				}).on('object:modified', (e) => {
					console.log(e)
				}).on('mouse:wheel', (opt) => {
					var delta = opt.e.deltaY;
					// console.log(delta)
					var zoom = canvas.getZoom();
					if (zoom > this.maxZoom) zoom = this.maxZoom;
					if (zoom < this.minZoom) zoom = this.minZoom;	
					if( (zoom > this.minZoom && zoom < this.maxZoom) || (zoom == this.minZoom && delta < 0) || (zoom == this.maxZoom && delta > 0) ){
						zoom *= 0.999 ** delta;
						this.panned = true
						this.zoom = zoom
						canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
					}
					opt.e.preventDefault();
					opt.e.stopPropagation();
				},)


				resolve()
			})
		},
		setupBackground(){
			return new Promise( (resolve) => {
				var canvas = this.croppingCanvas
				fabric.Image.fromURL('/estudio/grid.jpg', function(img) {
					var patternSourceCanvas = new fabric.StaticCanvas()
					patternSourceCanvas.add(img)

					console.log(img.type)
					patternSourceCanvas.setDimensions({
						width: img.getScaledWidth(),
						height: img.getScaledHeight(),
					})
					patternSourceCanvas.setBackgroundColor('yellow', patternSourceCanvas.renderAll.bind(patternSourceCanvas))
					var b64 = patternSourceCanvas.toDataURL({multiplier: 0.15})

					var pattern = new fabric.Pattern({
						source: b64,
						// source: function() {
						// 	return patternSourceCanvas.getElement();
						// },
						scale:0.2,
						repeat: 'repeat'
					})

					canvas.backgroundColor = pattern
					canvas.renderAll()
					resolve()
				});
			})
		},
		setupClippingObjects(){
			return new Promise( (resolve) => {
				var canvas = this.croppingCanvas

				var rect = new fabric.Rect({
					id:'clipPath',
					width:200,
					height:200,
					centeredScaling: true,
					centeredRotation: true,
					originX:'left',
					originY:'top',
					lockRotation:true,
					hasRotatingPoint:false,
					fill:'#f00',
					absolutePositioned: true,
					inverted:true,
					opacity:0.0000000000000001,
				})
				
				this.clipWidth = rect.width
				this.clipHeight = rect.height
				
				rect.on('scaling', (e) => {
					this.limitClipScale(e)
				}).on('moving', (e) => {
					this.limitClipMove(e)
				})
				
				canvas.add(rect)
				rect.center().setCoords()
				
				var rectLg = new fabric.Rect({
					id:'overlay',
					selectable:false,
					fill:'#00000099',
					originX:'center',
					originY:'center',
					clipPath:rect,
					inverted:true,
					absolutePositioned: true,
				})

				rect.setControlsVisibility({
				    mt: true,
				    mb: true,
				    ml: true,
				    mr: true,
				    tr: true,
				    tl: true,
				    br: true,
				    bl: true,
				    mtr: false,
				});

				canvas.add(rectLg)
				rectLg.center().setCoords()
				resolve()
			})
		},
		setupCroppingImage(src){
			return new Promise( (resolve) => {
				var canvas = this.croppingCanvas
				fabric.Image.fromURL(src, (img) => {
					this.croppingImg = img
					var rC = canvas.width / canvas.height
					var rI = img.width / img.height
					const objects = canvas.getObjects()
					var overlay = objects.find( o => o.id == 'overlay')
					var clipPath = objects.find( o => o.id == 'clipPath')

					img.originX = 'center'
					img.originY = 'center'
					
					if (rC < rI) {
						img.scaleToWidth(canvas.width)
					} else {
						img.scaleToHeight(canvas.height)
					}
					var clone = fabric.util.object.clone(img)
					canvas.add(img)

					clone.selectable = false
					canvas.add(clone)
					clone.center().setCoords()
					clone.sendToBack()

					
					overlay.width = img.getScaledWidth()
					overlay.height = img.getScaledHeight()

					img.set('clipPath',overlay)

					img.selectable = false
					img.center().setCoords()

					this.maxScaleX = img.getScaledWidth()/clipPath.width
					this.maxScaleY = img.getScaledHeight()/clipPath.height
					
					canvas.setActiveObject(clipPath)

					canvas.renderAll()
					resolve()
				})
			})
		},
		limitClipScale(e){
			var object = this.croppingCanvas.getActiveObject()
			const imgWidth = this.croppingImg.getScaledWidth()
			const imgHeight = this.croppingImg.getScaledHeight()
			const imgTop = this.croppingImg.top - imgHeight/2
			const imgLeft = this.croppingImg.left - imgWidth/2
			
			const clipWidth = object.getScaledWidth()
			const clipHeight = object.getScaledHeight()
			const clipTop = object.top // - clipHeight/2
			const clipLeft = object.left // - clipWidth/2

			if(clipTop < imgTop){
				object.top = imgTop // + clipHeight/2
			}
			if(clipLeft < imgLeft){
				object.left = imgLeft // + clipWidth/2
			}

			if(clipTop + clipHeight > imgTop + imgHeight){
				object.top = imgTop + imgHeight - clipHeight // /2
			}

			if(clipLeft + clipWidth > imgLeft + imgWidth){
				object.left = imgLeft + imgWidth - clipWidth // /2
			}

			if(object.scaleX > this.maxScaleX){
				object.set('scaleX', this.maxScaleX)
				object.left = imgLeft // + imgWidth/2
			}
			if(object.scaleY > this.maxScaleY){
				object.set('scaleY', this.maxScaleY)
				object.top = imgTop // + imgHeight/2
			}

			object.setCoords()
			this.clipWidth = object.getScaledWidth()
			this.clipHeight = object.getScaledHeight()

		},
		limitClipMove(e){
			var object = this.croppingCanvas.getActiveObject()
			const imgWidth = this.croppingImg.getScaledWidth()
			const imgHeight = this.croppingImg.getScaledHeight()
			const imgTop = this.croppingImg.top - imgHeight/2
			const imgLeft = this.croppingImg.left - imgWidth/2
			
			const clipWidth = object.getScaledWidth()
			const clipHeight = object.getScaledHeight()
			const clipTop = object.top // - clipHeight/2
			const clipLeft = object.left // - clipWidth/2

			if(clipTop < imgTop){
				object.top = imgTop // + clipHeight/2
			}
			if(clipLeft < imgLeft){
				object.left = imgLeft // + clipWidth/2
			}

			if(clipTop + clipHeight > imgTop + imgHeight){
				object.top = imgTop + imgHeight - clipHeight // /2
			}

			if(clipLeft + clipWidth > imgLeft + imgWidth){
				object.left = imgLeft + imgWidth - clipWidth // /2
			}
		},
		crop(){
			var clipPath = this.croppingCanvas.getActiveObject()
			var base64 = this.croppingCanvas.toDataURL({
				top: clipPath.top, // - clipPath.getScaledHeight()/2,
				left: clipPath.left, // - clipPath.getScaledWidth()/2,
				width: clipPath.getScaledWidth(),
				height: clipPath.getScaledHeight(),
				quality:1,
				multiply:1/this.croppingImg.scaleX,
				enableRetinaScaling:true,
			})
			this.$nuxt.$emit('imageCropped', {
				base64
			})

			this.$store.commit('estudio/main/SET_CROPPING_ID', null)
			
			// if(this.$breakpoints.sMd){
			// 	this.$store.commit('common/SET_ACTIVE_PANEL')
			// }
		},
		dimChanged($event, prop){
			this.$set(this, prop, parseFloat($event.target.value))
		}
	},
}
</script>
<template>
	<div
		class="flex justify-center rounded-lg overflow-hidden"
		:style="{
			width: $breakpoints.lSm ? '1280px':'100%'
		}"
		:class="{
			'flex-col': $breakpoints.width < windowHeight,
		}">
		<div :style="{
				'width': $breakpoints.width > windowHeight ? '280px':'100%',
			}"
			class="bg-gray-800 crop-controls shrink grow-0 pa-3"
		>
			<div class="flex flex-col fill-height">
				<div class="grow-1 py-3 px-4">
					<div class="mb-3">
						<div class="mb-4">
							<div class="mb-1 font-bold text-white">Largura</div>
							<input
								placeholder="Ex.: 200"
								type="number"
								:value="Math.round(clipWidth.toFixed(1) * 100)/100"
								class="text-sm rounded h-8 w-full px-2"
								@keyup="dimChanged($event, 'clipWidth')"
							/>
						</div>
						<div>
							<div class="mb-1 font-bold text-white">Altura</div>
							<input
								placeholder="Ex.: 200"
								type="number"
								:value="Math.round(clipHeight * 100)/100"
								class="text-sm rounded h-8 w-full px-2"
								@keyup="dimChanged($event, 'clipHeight')"
							/>
						</div>
					</div>
				</div>
				<div class="flex shrink-1 grow-0 items-end px-4 py-3">
					<button
						class="font-bold w-full h-8 rounded bg-green-500 hover:bg-green-600"
						@click="crop"
					>
						Cortar
					</button>
				</div>
			</div>
		</div>
		<div
			:class="{
				'order-first': $breakpoints.width < $breakpoints.height,
			}"
			class="align-stretch grow"
			id="cropCanvasWrapper"
		>
			<canvas id="maskCanvas">
			</canvas>
			<div class="size-indicator text-white py-1 px-2">{{clipWidth.toFixed(1) + ' x ' + clipHeight.toFixed(1)}}</div>
		</div>
	</div>
</template>
<style lang="sass" scoped>
#cropCanvasWrapper
	position: relative
	.size-indicator
		position: absolute
		bottom: 10px
		right: 10px
		background: rgba(0,0,0,0.7)
		font-size: 0.7em
</style>