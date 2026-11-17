import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const SCENE_BACKGROUND_COLOR = '#020308';
const MESH_BASIC_MATERIAL_COLOR = '#55e7d9';

export class UniverseEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private timer = new THREE.Timer();

    private animationFrameId: number | null = null;
    private testObject: THREE.Mesh;

    constructor(private container: HTMLElement) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);

        this.camera.position.set(0, 0, 35);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
        });

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.renderer.setSize(width, height);

        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        container.appendChild(this.renderer.domElement);

        // Camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.minDistance = 5;
        this.controls.maxDistance = 150;

        // Temporary test object
        const geometry = new THREE.IcosahedronGeometry(8, 2);

        const material = new THREE.MeshBasicMaterial({
            color: MESH_BASIC_MATERIAL_COLOR,
            wireframe: true,
            transparent: true,
            opacity: 0.65,
        });

        this.testObject = new THREE.Mesh(geometry, material);
        this.scene.add(this.testObject);
    }

    start() {
        if (this.animationFrameId !== null) {
            return;
        }

        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);

            // Update timer once per frame
            this.timer.update();

            const delta = this.timer.getDelta();

            this.testObject.rotation.y += delta * 0.12;
            this.testObject.rotation.x += delta * 0.04;

            this.controls.update();

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        if (width === 0 || height === 0) {
            return;
        }

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    dispose() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.controls.dispose();

        this.testObject.geometry.dispose();

        const material = this.testObject.material;

        if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
        } else {
            material.dispose();
        }

        this.scene.remove(this.testObject);
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
