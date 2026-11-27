import * as THREE from 'three';
import type { KnowledgeCategory, KnowledgeGraph, KnowledgeEdge } from '../../types/knowledge';
import { ForceDirectedLayout } from '../layouts/ForceDirectedLayout';

const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
    mathematics: '#38bdf8',
    physics: '#a78bfa',
    biology: '#34d399',
    technology: '#fbbf24',
    philosophy: '#f472b6',
};

const EDGE_COLOR = '#8acdd8';

export class KnowledgeGraphSystem {
    readonly group = new THREE.Group();

    private layout: ForceDirectedLayout;

    private dummy = new THREE.Object3D();

    private nodeGeometry: THREE.SphereGeometry;
    private nodeMaterial: THREE.MeshBasicMaterial;
    private nodeMesh: THREE.InstancedMesh;

    private edgeGeometry: THREE.BufferGeometry;
    private edgeMaterial: THREE.LineBasicMaterial;

    private validEdges: KnowledgeEdge[];

    private edgePositionAttribute: THREE.BufferAttribute;

    constructor(private graph: KnowledgeGraph) {
        this.layout = new ForceDirectedLayout(graph);

        // Nodes
        this.nodeGeometry = new THREE.SphereGeometry(1, 16, 16);

        this.nodeMaterial = new THREE.MeshBasicMaterial({
            color: '#ffffff',
        });

        this.nodeMesh = new THREE.InstancedMesh(this.nodeGeometry, this.nodeMaterial, this.graph.nodes.length);

        this.nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        this.graph.nodes.forEach((node, index) => {
            this.nodeMesh.setColorAt(index, new THREE.Color(CATEGORY_COLORS[node.category]));
        });

        if (this.nodeMesh.instanceColor) {
            this.nodeMesh.instanceColor.needsUpdate = true;
        }

        this.group.add(this.nodeMesh);

        // Edges
        this.validEdges = this.graph.edges.filter((edge) => {
            const source = this.layout.getPosition(edge.source);
            const target = this.layout.getPosition(edge.target);

            return source !== undefined && target !== undefined;
        });

        this.edgeGeometry = new THREE.BufferGeometry();

        this.edgePositionAttribute = new THREE.BufferAttribute(new Float32Array(this.validEdges.length * 6), 3);

        this.edgePositionAttribute.setUsage(THREE.DynamicDrawUsage);

        this.edgeGeometry.setAttribute('position', this.edgePositionAttribute);

        this.edgeMaterial = new THREE.LineBasicMaterial({
            color: EDGE_COLOR,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const edges = new THREE.LineSegments(this.edgeGeometry, this.edgeMaterial);

        this.group.add(edges);

        this.updateNodes();
        this.updateEdges();
    }

    private updateNodes() {
        this.graph.nodes.forEach((node, index) => {
            const position = this.layout.getPosition(node.id);

            if (!position) {
                return;
            }

            const size = 0.6 + node.importance * 1.4;

            this.dummy.position.copy(position);
            this.dummy.scale.setScalar(size);
            this.dummy.updateMatrix();

            this.nodeMesh.setMatrixAt(index, this.dummy.matrix);
        });

        this.nodeMesh.instanceMatrix.needsUpdate = true;

        this.nodeMesh.computeBoundingSphere();
    }

    private updateEdges() {
        this.validEdges.forEach((edge, index) => {
            const source = this.layout.getPosition(edge.source);
            const target = this.layout.getPosition(edge.target);

            if (!source || !target) {
                return;
            }

            const vertexIndex = index * 2;

            this.edgePositionAttribute.setXYZ(vertexIndex, source.x, source.y, source.z);

            this.edgePositionAttribute.setXYZ(vertexIndex + 1, target.x, target.y, target.z);
        });

        this.edgePositionAttribute.needsUpdate = true;

        this.edgeGeometry.computeBoundingSphere();
    }

    update(delta: number) {
        this.layout.update(delta);

        this.updateNodes();
        this.updateEdges();

        this.group.rotation.y += delta * 0.012;
    }

    dispose() {
        this.layout.dispose();

        this.nodeMesh.dispose();

        this.nodeGeometry.dispose();
        this.nodeMaterial.dispose();

        this.edgeGeometry.dispose();
        this.edgeMaterial.dispose();

        this.group.clear();
    }
}
