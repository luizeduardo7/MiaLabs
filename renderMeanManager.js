import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const renderMean = (scene) => {
	const meanGroup = new THREE.Group()
	let meanManager = {
		mean: '',
		try: 0,
		font: undefined,
		meanMesh: null,
		fontUri: 'node_modules/three/examples/fonts/gentilis_regular.typeface.json',
		createMeanMeshInScene: (meanValue, scene) => {
			new FontLoader().load(
				meanManager.fontUri,
				(response) => (meanManager.font = response)
			)
			const textGeom = new TextGeometry(`mean: ${meanValue}`, {
				font: meanManager.font,
				size: 2,
				height: 3,
				curveSegments: 12,
			})

			textGeom.computeBoundingBox()
			const centerOffset =
				-0.5 * (textGeom.boundingBox.max.x - textGeom.boundingBox.min.x)

			meanManager.meanMesh = new THREE.Mesh(
				textGeom,
				new THREE.MeshStandardMaterial()
			)

			meanManager.meanMesh.position.x = centerOffset + 17
			meanManager.meanMesh.position.y = 22
			meanManager.meanMesh.position.z = -18

			meanManager.meanMesh.rotation.x = 0
			meanManager.meanMesh.rotation.y = Math.PI * 2

			scene.add(meanManager.meanMesh)
		},
		updateMeanMeshInScene: (scene) => {
			if (meanManager.meanMesh !== null) {
				scene.remove(meanManager.meanMesh)
				meanManager.createMeanMeshInScene(meanManager.mean, scene)
			}
		},
		meanCalculator: () => {
			meanManager.mean = scoreManager.score + '/' + scoreManager.try
		},
	}

	meanManager.createMeanMeshInScene(0, meanGroup)
	scene.add(meanGroup)

	return meanManager
}

export default renderMean
