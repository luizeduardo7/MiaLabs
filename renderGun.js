import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const renderGun = (scene, group) => {
	// Gun
	const loader = new GLTFLoader()
	let base = new THREE.Object3D()
	scene.add(base)
	loader.load(
		'/Glock18.gltf',
		function (gltf) {
			gltf.scene.scale.setScalar(1)
			base.add(gltf.scene)
		},
		function (texture) {
			// in this example we create the material when the texture is loaded
			texture.colorSpace = THREE.SRGBColorSpace
			texture.flipY = true
		},
		undefined,
		function (error) {
			console.error(error)
		}
	)

	// Group Gun
	group.add(base)
	scene.add(group)
	base.position.set(1, -1, 0)
	group.position.set(-2, -1, 15)
}

export default renderGun
