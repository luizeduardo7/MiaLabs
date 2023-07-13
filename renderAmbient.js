import * as THREE from 'three'

const renderAmbient = (scene) => {
	const map = new THREE.TextureLoader().load('/sprite.jpg')
	const planeGeometry = new THREE.PlaneGeometry(50, 50, 40, 40)
	const planeMaterial = new THREE.MeshStandardMaterial({ map: map })
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.rotation.x = 4.8
	plane.position.y = -5
	plane.receiveShadow = true
	scene.add(plane)

	// back wall
	const planeGeometry2 = new THREE.PlaneGeometry(50, 50, 40, 40)
	const planeMaterial2 = new THREE.MeshStandardMaterial({ color: 0x000000 })
	const back = new THREE.Mesh(planeGeometry2, planeMaterial2)
	back.receiveShadow = true
	back.position.z = -15
	scene.add(back)
	// left wall
	const cs = new THREE.TextureLoader().load('/csgo.jpg')
	const planeGeometry3 = new THREE.PlaneGeometry(50, 40, 40, 40)
	const planeMaterial3 = new THREE.MeshStandardMaterial({ map: cs })
	const left = new THREE.Mesh(planeGeometry3, planeMaterial3)
	left.receiveShadow = true
	left.rotation.y = Math.PI / 2
	left.position.y = 5
	left.position.x = -25
	scene.add(left)

	// right wall
	const medal = new THREE.TextureLoader().load('/medal.jpg')
	const planeGeometry4 = new THREE.PlaneGeometry(10, 20, 50, 20)
	const planeMaterial4 = new THREE.MeshStandardMaterial({ map: medal })
	const right = new THREE.Mesh(planeGeometry4, planeMaterial4)
	right.receiveShadow = true
	right.rotation.y = -0.5
	right.position.y = 5
	right.position.z = -1
	right.position.x = 20
	scene.add(right)
}

export default renderAmbient
