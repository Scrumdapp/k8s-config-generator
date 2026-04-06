import {createRootNode, createSchemaNode, SchemaNode} from "../../../src/schema/schemaNode";
import {schemaTypes} from "../../../src/schema/schemaTypes";
import {dockerImageType} from "../../../src/schema/schemaTypes/dockerImageType";


describe("Test the docker_image type", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, dockerImageType, "docker_image")
    })

    test("check if name responds to nameType", () => {
        expect(schemaTypes.get("docker_image")).toBe(dockerImageType)
    })

    describe("Parsing schema data", () => {

        test("inline declaration", () => {
            dockerImageType.build("docker_image", node)
            expect(node.data.required).toBe(true)
        })

        test("separate declaration", () => {
            dockerImageType.build({ _type: "docker_image" }, node)
            expect(node.data.required).toBe(undefined)
        })

        test("inline declaration", () => {
            dockerImageType.build({ _type: "docker_image", required: true }, node)
            expect(node.data.required).toBe(true)
        })

        test("inline declaration with required set to false", () => {
            dockerImageType.build({ _type: "docker_image", required: false }, node)
            expect(node.data.required).toBe(false)
        })
    })

    describe("Parsing values", () => {
        describe("Simple value tests", () => {
            beforeEach(() => {
                dockerImageType.build("docker_image", node)
            })

            test.each([
                [ "nginx" ],
                [ "redis" ],
                [ "python:3.11" ],
                [ "node:18-alpine" ],
                [ "myorg/myapp" ],
                [ "myorg/myapp:1.2.3" ],
                [ "registry.example.com:3000/myorg/myapp:latest" ],
                [ "registry:3000/myorg/myapp:latest" ],
                [ "registry:3000/myapp:latest" ],
                [ "gcr.io/project-id/myapp:2026-04-06" ],
                [ "docker.io/library/ubuntu:22.04" ],
            ])("value %p", (v) => {
                const r = dockerImageType.parseValue(v, node)
                expect(r).toBe(v)
            })

            test.each([
                [ "UpperCaseOrg/MyApp" ],
                [ "name with spaces" ],
                [ "myorg/myapp:tag:extra" ],
                [ "registry:5000:myapp" ],
                [ "https://registry:5000/myapp" ],
                [ "myorg/..hidden" ],
                [ "myorg/my app" ],
                [ "strange@notsha256:abcd" ],
            ])("value %p to throw", (v) => {
                expect(() => dockerImageType.parseValue(v, node)).toThrow()
            })

            test("required throw", () => {
                expect(() => dockerImageType.parseValue(undefined, node)).toThrow()
            })

            test("number type", () => {
                expect(() => dockerImageType.parseValue(0, node)).toThrow()
            })

            test("null type", () => {
                expect(() => dockerImageType.parseValue(null, node)).toThrow()
            })
        })

        test("undefined without required", () => {
            dockerImageType.build({ _type: "docker_image" }, node)
            const v = dockerImageType.parseValue(undefined, node)
            expect(v).toBe(undefined)
        })

        test("null without required", () => {
            dockerImageType.build({ _type: "docker_image" }, node)
            const v = dockerImageType.parseValue(null, node)
            expect(v).toBe(undefined)
        })
    })
})