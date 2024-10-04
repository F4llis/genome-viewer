import Controller from "./controller";
import Model from "./model";
import Viewer from "./viewer";


// Main class of genome viewer
export default class API {

    constructor(container_id, type_chromosome) {

        // Instanciate the MVC element
        this.controller = new Controller()
        this.viewer = new Viewer(container_id)
        this.model = new Model()
        this.connect_MVC()

        this.settings = {
            'type_chromosome': type_chromosome,
            'sorting_chromosome': 'size',
        }

    }

    connect_MVC(){

        // Add api to each element
        this.controller.api = this
        this.model.api  =  this
        this.viewer.api = this

        // plug controller
        this.controller.model = this.model
        this.controller.viewer = this.viewer

        // plug model
        this.model.controller = this.controller
        this.model.viewer = this.viewer

        // plug viewer
        this.viewer.model = this.model
        this.viewer.controller = this.controller

    }

    add_chromosomes(json, format_data){
        this.controller.add_chromosome_data(json, format_data)
    }

    configure(settings){

        for(var key in settings) {
            var value = settings[key];
                this.settings[key] = value;
            }

    }

    start_viewer(){
        this.controller.start_viewer()
    }




}
