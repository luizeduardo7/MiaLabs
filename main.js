import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { randFloat, randInt } from 'three/src/math/MathUtils'
import renderAmbient from './renderAmbient.js'
import renderGun from './renderGun.js'
import renderScore from './renderScore.js'
import renderTimer from './renderTimer.js'
import renderMean from './renderMeanManager.js'

const startButton = document.getElementById('startButton')
startButton.addEventListener('click', init)

function init() {
	const overlay = document.getElementById('overlay')
	overlay.remove()

	// ThreeJS build pattern
	const scene = new THREE.Scene()

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)

	const renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.outputColorSpace = THREE.SRGBColorSpace
	document.body.appendChild(renderer.domElement)

	// Spot Light
	const spotLight = new THREE.SpotLight(0xffffff)
	spotLight.position.set(100, 10, 100)
	spotLight.castShadow = true
	scene.add(spotLight)

	const group = new THREE.Group()
	renderGun(scene, group)

	renderAmbient(scene)

	const scoreManager = renderScore(scene)
	const timeManager = renderTimer(scene)
	const meanManager = renderMean(scene)

	const calculateScore = () => {
		if (timeManager.time < 40) {
			scoreManager.countPoint()
			scoreManager.updateScoreMeshInScene(scene)
		}
	}

	const calculateTry = () => {
		if (timeManager.time < 40) {
			scoreManager.coutTry()
		}
	}

	const calculateTime = () => {
		if (timeManager.time < 40 && scoreManager.try > 0) {
			timeManager.countPoint()
			timeManager.updateTimeMeshInScene(scene)
			meanManager.meanCalculator()
			meanManager.updateMeanMeshInScene(scene)
		}
		renderer.render(scene, camera)
	}

	// Create Spheres
	function makeSpheres(x, y) {
		for (let i = -4; i < y; i++) {
			for (let j = -4; j < x; j++) {
				const geometry2 = new THREE.SphereGeometry(0.6)
				const material2 = new THREE.MeshPhongMaterial({ color: 0x0000ff })
				const sphere = new THREE.Mesh(geometry2, material2)
				sphere.position.set(
					randFloat(j * 2, j * 2.5),
					randFloat(i * 2, i * 2.5),
					randFloat(0, 3)
				)
				sphere.position.y += 9
				sphere.castShadow = true
				sphere.receiveShadow = true
				scene.add(sphere)
			}
		}
	}

	makeSpheres(3, 0)

	function makeOneSphere(spher) {
		const geometry2 = new THREE.SphereGeometry(0.6)
		const material2 = new THREE.MeshPhongMaterial({ color: 0x0000ff })
		const sphere = new THREE.Mesh(geometry2, material2)
		x = spher.position.x += randInt(-0.7, 0.7)
		z = spher.position.x += randInt(-0.7, 0.7)
		z = spher.position.z += randInt(0, 1.7)
		sphere.position.set(x, y, z)
		sphere.castShadow = true
		sphere.receiveShadow = true
		if (sphere.position.x > -5 && sphere.position.x < 4) scene.add(sphere)
	}

	camera.position.set(0, 0, 18)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enabled = false
	function onDocumentKeyDown(event) {
		var keyCode = event.which

		switch (keyCode) {
			case 69: // e - nable
				controls.enabled = true
				break
			case 68: // d - isable
				controls.enabled = false
				break
			case 82: // esc
				location.reload()
				break
			case 27: // esc
				window.close()
				break
		}
		renderer.render(scene, camera)
	}

	// Mouse Variables
	const raycaster = new THREE.Raycaster()
	const pointer = new THREE.Vector2()
	let INTERSECTED

	function onPointerMove(event) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	}

	const plane2 = new THREE.Plane(new THREE.Vector3(0, 0, 2), 2)
	const mouse = new THREE.Vector2()
	const pointOfIntersection = new THREE.Vector3()

	function onMouseMove(event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(mouse, camera)
		raycaster.ray.intersectPlane(plane2, pointOfIntersection)
		group.lookAt(pointOfIntersection)
	}

	// Shoot
	const listener = new THREE.AudioListener()
	camera.add(listener)
	const sound = new THREE.Audio(listener)
	const utopiaElement = document.getElementById('song')
	sound.setMediaElementSource(utopiaElement)
	sound.setVolume(0.5)
	const audioLoader = new THREE.AudioLoader()
	audioLoader.load('/shoot.ogg', function (buffer) {
		sound.setBuffer(buffer)
		sound.setVolume(0.5)
	})

	async function mouseClick() {
		sound.play()
		utopiaElement.play()
		const tweenGo = new TWEEN.Tween({ xRotation: group.rotation.x })
			.to({ xRotation: (group.rotation.x += 0.3) }, 200)
			.onUpdate((coords) => {
				group.rotation.x = coords.xRotation
			})
		tweenGo.start()

		const tweenBack = new TWEEN.Tween({ xRotation: group.rotation.x })
			.to({ xRotation: (group.rotation.x -= 0.3) }, 200)
			.onUpdate((coords) => {
				group.rotation.x = coords.xRotation
			})
		tweenBack.start()

		calculateTry()

		if (
			scene.children[3] != INTERSECTED &&
			scene.children[4] != INTERSECTED &&
			scene.children[5] != INTERSECTED &&
			scene.children[6].children[0] != INTERSECTED
		) {
			calculateScore()
			makeOneSphere(INTERSECTED)
			scene.remove(INTERSECTED)
		}
	}

	// Intersection with mouse pointer
	function mouseIntersect() {
		raycaster.setFromCamera(pointer, camera)

		const intersects = raycaster.intersectObjects(scene.children, false)
		if (intersects.length > 0) {
			if (
				INTERSECTED != intersects[0].object &&
				scene.children[2] != intersects[0].object
			) {
				if (INTERSECTED)
					INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

				INTERSECTED = intersects[0].object
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
				if (
					scene.children[3] != INTERSECTED &&
					scene.children[4] != INTERSECTED &&
					scene.children[5] != INTERSECTED &&
					scene.children[6].children[0] != INTERSECTED
				)
					INTERSECTED.material.emissive.setHex(0xff0000)
			}
		}
		renderer.render(scene, camera)
	}

	function animate() {
		requestAnimationFrame(animate)
		window.requestAnimationFrame(calculateTime)
		window.addEventListener('keydown', onDocumentKeyDown, false)
		TWEEN.update()
		window.addEventListener('pointermove', onPointerMove)
		window.addEventListener('click', mouseClick, false)
		window.addEventListener('mousemove', onMouseMove, false)
		window.requestAnimationFrame(mouseIntersect)
		controls.update()
		renderer.render(scene, camera)
	}

	animate()
}
