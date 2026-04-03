import FS from 'fs'
import YAML from 'yaml'


const file = FS.readFileSync("test/templates/service/_schema.yaml", "utf8")
const d = YAML.parse(file)
console.log(d)

