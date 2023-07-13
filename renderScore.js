import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const renderScore = (scene) => {
	const scoreGroup = new THREE.Group()
	const scoreManager = {
		score: 0,
		try: 0,
		font: undefined,
		scoreMesh: null,
		fontUri: 'node_modules/three/examples/fonts/gentilis_regular.typeface.json',
		createScoreMeshInScene: (scoreValue, scene) => {
			new FontLoader().load(
				scoreManager.fontUri,
				(response) => (scoreManager.font = response)
			)
			const textGeom = new TextGeometry(`score: ${scoreValue}`, {
				font: scoreManager.font,
				size: 2,
				height: 3,
				curveSegments: 12,
			})

			textGeom.computeBoundingBox()
			const centerOffset =
				-0.5 * (textGeom.boundingBox.max.x - textGeom.boundingBox.min.x)

			scoreManager.scoreMesh = new THREE.Mesh(
				textGeom,
				new THREE.MeshStandardMaterial()
			)

			scoreManager.scoreMesh.position.x = centerOffset - 17
			scoreManager.scoreMesh.position.y = 22
			scoreManager.scoreMesh.position.z = -18

			scoreManager.scoreMesh.rotation.x = 0
			scoreManager.scoreMesh.rotation.y = Math.PI * 2

			scene.add(scoreManager.scoreMesh)
		},
		updateScoreMeshInScene: (scene) => {
			if (scoreManager.scoreMesh !== null) {
				scene.remove(scoreManager.scoreMesh)
				scoreManager.createScoreMeshInScene(scoreManager.score, scene)
			}
		},
		countPoint: () => (scoreManager.score += 1),
		coutTry: () => (scoreManager.try += 1),
	}

	scoreManager.createScoreMeshInScene(0, scoreGroup)

	scene.add(scoreGroup)

	return scoreManager
}

export default renderScore
