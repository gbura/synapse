import * as THREE from 'three';

const LINE_MATERIAL_COLOR = '#36c8cb';
const NODE_MATERIAL_COLOR = '#a8fff4';

export class NeuralStructureSystem {
    readonly group = new THREE.Group();

    private lineGeometry: THREE.BufferGeometry;
    private lineMaterial: THREE.LineBasicMaterial;

    private nodeGeometry: THREE.BufferGeometry;
    private nodeMaterial: THREE.PointsMaterial;

    constructor() {
        const linePositions: number[] = [];
        const nodePositions: number[] = [];

        const clusterCount = 14;
        const branchesPerCluster = 7;

        const addNode = (point: THREE.Vector3) => {
            nodePositions.push(point.x, point.y, point.z);
        };

        const addCurve = (points: THREE.Vector3[]) => {
            const curve = new THREE.CatmullRomCurve3(points);
            const samples = curve.getPoints(24);

            for (let i = 0; i < samples.length - 1; i++) {
                const a = samples[i]!;
                const b = samples[i + 1]!;

                linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
            }
        };

        for (let i = 0; i < clusterCount; i++) {
            // Distribute cluster centers in a broad 3D cloud
            const center = new THREE.Vector3(
                (Math.random() - 0.5) * 85,
                (Math.random() - 0.5) * 28,
                (Math.random() - 0.5) * 85,
            );

            addNode(center);

            for (let j = 0; j < branchesPerCluster; j++) {
                const direction = new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                ).normalize();

                const length = 8 + Math.random() * 16;

                const middle = center.clone().addScaledVector(direction, length * 0.5);

                middle.add(
                    new THREE.Vector3((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7),
                );

                const end = center.clone().addScaledVector(direction, length);

                addCurve([center, middle, end]);
                addNode(end);

                // A smaller branch extending from the endpoint
                if (Math.random() > 0.4) {
                    const twigDirection = direction
                        .clone()
                        .add(
                            new THREE.Vector3(
                                (Math.random() - 0.5) * 0.8,
                                (Math.random() - 0.5) * 0.8,
                                (Math.random() - 0.5) * 0.8,
                            ),
                        )
                        .normalize();

                    const twigEnd = end.clone().addScaledVector(twigDirection, 4 + Math.random() * 7);

                    addCurve([end, end.clone().lerp(twigEnd, 0.5), twigEnd]);

                    addNode(twigEnd);
                }
            }
        }

        // All filaments share one geometry and material
        this.lineGeometry = new THREE.BufferGeometry();
        this.lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: LINE_MATERIAL_COLOR,
            transparent: true,
            opacity: 0.24,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const filaments = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);

        this.group.add(filaments);

        // Neuron centers and branch endpoints
        this.nodeGeometry = new THREE.BufferGeometry();
        this.nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));

        this.nodeMaterial = new THREE.PointsMaterial({
            color: NODE_MATERIAL_COLOR,
            size: 0.48,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const nodes = new THREE.Points(this.nodeGeometry, this.nodeMaterial);

        this.group.add(nodes);
    }

    update(delta: number) {
        this.group.rotation.y -= delta * 0.006;
    }

    dispose() {
        this.lineGeometry.dispose();
        this.lineMaterial.dispose();

        this.nodeGeometry.dispose();
        this.nodeMaterial.dispose();

        this.group.clear();
    }
}
