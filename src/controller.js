export default class Controller {

    constructor() {

        this.api = null
        this.model = null
        this.viewer = null


    }

    add_chromosome_data(json, format_data){

        switch (format_data) {
            case 'oma_api':
                this.model.add_chromosome_data_oma(json)
                break;
            default:
                console.log(`Invalid data type:` + format_data);
        }

    }

    start_viewer(){
        this.viewer.render()
    }

}