import YAML from 'yaml'


export function parseYaml(yaml: string) {
    return YAML.parse(yaml)
}
