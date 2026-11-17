import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParticleSystem } from '../systems/ParticleSystem';

const SCENE_BACKGROUND_COLOR = '#020308';

export class UniverseEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private timer = new THREE.Timer();

    private animationFrameId: number | null = null;
    private particleSystem: ParticleSystem;

    constructor(private container: HTMLElement) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);

        this.camera.position.set(0, 45, 110);
        this.camera.lookAt(0, 0, 0);

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
        this.controls.maxDistance = 250;

        this.particleSystem = new ParticleSystem(15000);

        this.scene.add(this.particleSystem.points);
    }

    start() {
        if (this.animationFrameId !== null) {
            return;
        }

        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);

            this.timer.update();

            const delta = this.timer.getDelta();

            this.particleSystem.update(delta);

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

        this.scene.remove(this.particleSystem.points);
        this.particleSystem.dispose();

        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
