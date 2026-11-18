import * as THREE from 'three';

const DEFAULT_PARTICLE_COUNT = 15000;
const INNER_COLOR = '#a7fff3';
const OUTER_COLOR = '#176b85';

export class ParticleSystem {
    readonly points: THREE.Points;

    private geometry: THREE.BufferGeometry;
    private material: THREE.PointsMaterial;

    constructor(count: number = DEFAULT_PARTICLE_COUNT) {
        this.geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3); // DEFAULT_PARTICLE_COUNT * 3 = 45000
        const colors = new Float32Array(count * 3); // DEFAULT_PARTICLE_COUNT * 3 = 45000

        const innerColor = new THREE.Color(INNER_COLOR);
        const outerColor = new THREE.Color(OUTER_COLOR);

        const arms = 5;
        const radius = 65;
        const spin = 1.8;
        const randomness = 0.35;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // More particles near the center
            const distance = Math.pow(Math.random(), 1.6) * radius;

            const armAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = distance * spin * 0.04;

            const randomOffset = () => (Math.random() - 0.5) * randomness * distance;

            const angle = armAngle + spinAngle;

            positions[i3] = Math.cos(angle) * distance + randomOffset();

            positions[i3 + 1] = randomOffset() * 0.45;

            positions[i3 + 2] = Math.sin(angle) * distance + randomOffset();

            // Color gradient based on distance
            const mixedColor = innerColor.clone();

            mixedColor.lerp(outerColor, Math.min(distance / radius, 1));

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.material = new THREE.PointsMaterial({
            size: 0.16,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.points = new THREE.Points(this.geometry, this.material);

        this.points.rotation.x = 0.35;
    }

    update(delta: number) {
        this.points.rotation.y += delta * 0.015;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
