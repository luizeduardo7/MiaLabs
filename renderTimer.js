import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const renderTimer = (scene) => {
	let seconds = new THREE.Clock()
	const timeGroup = new THREE.Group()
	const timeManager = {
		time: 0,
		font: undefined,
		timeMesh: null,
		fontUri: 'node_modules/three/examples/fonts/gentilis_regular.typeface.json',
		createTimeMeshInScene: (timeValue, scene) => {
			new FontLoader().load(
				timeManager.fontUri,
				(response) => (timeManager.font = response)
			)
			const textGeom = new TextGeometry(`time: ${timeValue}`, {
				font: timeManager.font,
				size: 2,
				height: 3,
				curveSegments: 12,
			})

			textGeom.computeBoundingBox()
			const centerOffset =
				-0.5 * (textGeom.boundingBox.max.x - textGeom.boundingBox.min.x)

			timeManager.timeMesh = new THREE.Mesh(
				textGeom,
				new THREE.MeshStandardMaterial()
			)

			timeManager.timeMesh.position.x = centerOffset
			timeManager.timeMesh.position.y = 22
			timeManager.timeMesh.position.z = -18

			timeManager.timeMesh.rotation.x = 0
			timeManager.timeMesh.rotation.y = Math.PI * 2

			scene.add(timeManager.timeMesh)
		},
		updateTimeMeshInScene: (scene) => {
			if (timeManager.timeMesh !== null) {
				scene.remove(timeManager.timeMesh)
				timeManager.createTimeMeshInScene(timeManager.time, scene)
			}
		},
		countPoint: () => (timeManager.time = seconds.getElapsedTime().toFixed(2)),
	}

	timeManager.createTimeMeshInScene(0, timeGroup)
	scene.add(timeGroup)

	return timeManager
}

export default renderTimer
