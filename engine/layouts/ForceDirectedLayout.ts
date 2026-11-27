import * as THREE from 'three';
import type { KnowledgeGraph } from '../../types/knowledge';

const INITIAL_RADIUS = 32;

const REPULSION_STRENGTH = 900;
const ATTRACTION_STRENGTH = 1.2;
const CENTERING_STRENGTH = 0.15;

const SPRING_LENGTH = 18;
const DAMPING = 2.5;
const MAX_SPEED = 20;

const FIXED_TIME_STEP = 1 / 60;
const MAX_SUBSTEPS = 5;

interface LayoutNode {
    id: string;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    force: THREE.Vector3;
}

interface LayoutEdge {
    source: LayoutNode;
    target: LayoutNode;
    weight: number;
}

export class ForceDirectedLayout {
    private nodes: LayoutNode[] = [];
    private edges: LayoutEdge[] = [];

    private nodeMap = new Map<LayoutNode['id'], LayoutNode>();

    private direction = new THREE.Vector3();

    private accumulator = 0;

    constructor(graph: KnowledgeGraph) {
        graph.nodes.forEach((node, index) => {
            const angle = (index / graph.nodes.length) * Math.PI * 2;

            const layoutNode: LayoutNode = {
                id: node.id,

                position: new THREE.Vector3(
                    Math.cos(angle) * INITIAL_RADIUS,
                    Math.sin(angle * 2) * 10,
                    Math.sin(angle) * INITIAL_RADIUS,
                ),

                velocity: new THREE.Vector3(),
                force: new THREE.Vector3(),
            };

            this.nodes.push(layoutNode);
            this.nodeMap.set(node.id, layoutNode);
        });

        for (const edge of graph.edges) {
            const source = this.nodeMap.get(edge.source);
            const target = this.nodeMap.get(edge.target);

            if (!source || !target) {
                continue;
            }

            this.edges.push({
                source,
                target,
                weight: edge.weight,
            });
        }
    }

    private resetForces() {
        for (const node of this.nodes) {
            node.force.set(0, 0, 0);
        }
    }

    private applyRepulsion() {
        for (let i = 0; i < this.nodes.length; i++) {
            const a = this.nodes[i]!;

            for (let j = i + 1; j < this.nodes.length; j++) {
                const b = this.nodes[j]!;

                this.direction.subVectors(a.position, b.position);

                const distanceSquared = Math.max(this.direction.lengthSq(), 0.25);

                const strength = REPULSION_STRENGTH / distanceSquared;

                if (this.direction.lengthSq() < 0.000001) {
                    this.direction.set(1, 0, 0);
                } else {
                    this.direction.normalize();
                }

                a.force.addScaledVector(this.direction, strength);

                b.force.addScaledVector(this.direction, -strength);
            }
        }
    }

    private applyAttraction() {
        for (const edge of this.edges) {
            this.direction.subVectors(edge.target.position, edge.source.position);

            const distance = this.direction.length();

            if (distance < 0.0001) {
                continue;
            }

            const displacement = distance - SPRING_LENGTH;

            const strength = displacement * ATTRACTION_STRENGTH * edge.weight;

            this.direction.divideScalar(distance);

            edge.source.force.addScaledVector(this.direction, strength);

            edge.target.force.addScaledVector(this.direction, -strength);
        }
    }

    private applyCentering() {
        for (const node of this.nodes) {
            node.force.addScaledVector(node.position, -CENTERING_STRENGTH);
        }
    }

    private integrate(delta: number) {
        const damping = Math.exp(-DAMPING * delta);

        for (const node of this.nodes) {
            node.velocity.addScaledVector(node.force, delta);

            node.velocity.multiplyScalar(damping);

            node.velocity.clampLength(0, MAX_SPEED);

            node.position.addScaledVector(node.velocity, delta);
        }
    }

    private step(delta: number) {
        this.resetForces();

        this.applyRepulsion();
        this.applyAttraction();
        this.applyCentering();

        this.integrate(delta);
    }

    update(delta: number) {
        this.accumulator += Math.min(Math.max(delta, 0), FIXED_TIME_STEP * MAX_SUBSTEPS);

        while (this.accumulator >= FIXED_TIME_STEP) {
            this.step(FIXED_TIME_STEP);

            this.accumulator -= FIXED_TIME_STEP;
        }
    }

    getPosition(id: string): THREE.Vector3 | undefined {
        return this.nodeMap.get(id)?.position;
    }

    dispose() {
        this.nodes.length = 0;
        this.edges.length = 0;

        this.nodeMap.clear();
        this.accumulator = 0;
    }
}
