import * as THREE from 'three';
import type { KnowledgeCategory, KnowledgeGraph } from '../../types/knowledge';

const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
    mathematics: '#38bdf8',
    physics: '#a78bfa',
    biology: '#34d399',
    technology: '#fbbf24',
    philosophy: '#f472b6',
};

const EDGE_COLOR = '#8acdd8';
const GRAPH_RADIUS = 32;

export class KnowledgeGraphSystem {
    readonly group = new THREE.Group();

    private nodePositions = new Map<string, THREE.Vector3>();

    private nodeGeometry: THREE.SphereGeometry;
    private nodeMaterial: THREE.MeshBasicMaterial;
    private nodeMesh: THREE.InstancedMesh;

    private edgeGeometry: THREE.BufferGeometry;
    private edgeMaterial: THREE.LineBasicMaterial;

    constructor(private graph: KnowledgeGraph) {
        // Node geometry and material
        this.nodeGeometry = new THREE.SphereGeometry(1, 16, 16);

        this.nodeMaterial = new THREE.MeshBasicMaterial({
            color: '#ffffff',
        });

        this.nodeMesh = new THREE.InstancedMesh(this.nodeGeometry, this.nodeMaterial, this.graph.nodes.length);

        const dummy = new THREE.Object3D();

        // Generate node instances
        this.graph.nodes.forEach((node, index) => {
            const angle = (index / this.graph.nodes.length) * Math.PI * 2;

            const position = new THREE.Vector3(
                Math.cos(angle) * GRAPH_RADIUS,
                Math.sin(angle * 2) * 10,
                Math.sin(angle) * GRAPH_RADIUS,
            );

            this.nodePositions.set(node.id, position);

            const size = 0.6 + node.importance * 1.4;

            dummy.position.copy(position);
            dummy.scale.setScalar(size);
            dummy.updateMatrix();

            this.nodeMesh.setMatrixAt(index, dummy.matrix);

            this.nodeMesh.setColorAt(index, new THREE.Color(CATEGORY_COLORS[node.category]));
        });

        this.nodeMesh.instanceMatrix.needsUpdate = true;

        if (this.nodeMesh.instanceColor) {
            this.nodeMesh.instanceColor.needsUpdate = true;
        }

        this.nodeMesh.computeBoundingSphere();

        this.group.add(this.nodeMesh);

        // Generate graph edges
        const edgePositions: number[] = [];

        for (const edge of this.graph.edges) {
            const source = this.nodePositions.get(edge.source);
            const target = this.nodePositions.get(edge.target);

            if (!source || !target) {
                console.warn('Invalid knowledge edge:', edge);
                continue;
            }

            edgePositions.push(source.x, source.y, source.z, target.x, target.y, target.z);
        }

        this.edgeGeometry = new THREE.BufferGeometry();

        this.edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));

        this.edgeMaterial = new THREE.LineBasicMaterial({
            color: EDGE_COLOR,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const edges = new THREE.LineSegments(this.edgeGeometry, this.edgeMaterial);

        this.group.add(edges);
    }

    update(delta: number) {
        this.group.rotation.y += delta * 0.012;
    }

    dispose() {
        this.nodeMesh.dispose();

        this.nodeGeometry.dispose();
        this.nodeMaterial.dispose();

        this.edgeGeometry.dispose();
        this.edgeMaterial.dispose();

        this.nodePositions.clear();
        this.group.clear();
    }
}
