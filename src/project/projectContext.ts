import {Template} from "../files/template";
import {SourceFolder} from "../files/sourceFolder";
import {createTemplate} from "../files/createTemplate";

export class ProjectContext {
    sources: SourceFolder
    private templates: Map<string, ProjectTemplate>

    constructor(sources: SourceFolder, templates: Map<string, ProjectTemplate>) {
        this.sources = sources
        this.templates = templates
    }

    getTemplate(name: string): Template {
        const projectTemplate = this.templates.get(name.toLowerCase())
        if (typeof projectTemplate === "undefined") {
            throw new Error(`Template ${name} does not exist`)
        }

        if (typeof projectTemplate.template === "undefined") {
            projectTemplate.template = createTemplate(projectTemplate.path)
        }

        return projectTemplate.template!!
    }
}

export interface ProjectTemplate {
    path: string
    template?: Template
}