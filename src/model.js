import * as perlin from './perlin.js'

var uid_chr = 0

export default class Model {

    constructor() {

        // MVC BINDING
        this.api = null
        this.controller = null
        this.viewer = null

        // DATA

        this.chromosomes = [] // CHROMOSOME -> {name, list:genes, list:links}
        this.xscale = null

    }

    add_chromosome_data_oma(data) {

        for (const dataKey in data) {

            var chromosome = new Chromosome()

            if (this.api.settings.type_chromosome == 'extant') {
                chromosome.genes = data[dataKey].nodes
                chromosome.links = data[dataKey].links

                chromosome.compute_size_in_bp()

                if (chromosome.genes[0]['chromosome']) {
                    chromosome.name = chromosome.genes[0]['chromosome']
                }

                chromosome.genes.sort((a, b) => (a.start > b.start) ? 1 : -1)
                chromosome.genes.forEach(gene => {  gene.color = perlin.simplex2(0, gene.start)})

            } else if (this.api.settings.type_chromosome == 'ancestral') {
                // Add things then add traversal with link to add relative position
            }

            this.chromosomes.push(chromosome)


        }


    }



    sorted_chromosome(ascending = true) {

        switch (this.api.settings.sorting_chromosome) {
            case 'number_genes':
                if (ascending) {
                    return this.chromosomes.sort((a, b) => (a.genes.length > b.genes.length) ? 1 : -1)
                } else {
                    return this.chromosomes.sort((a, b) => (a.genes.length > b.genes.length) ? -1 : 1)
                }

                break;
            case 'size':
                if (ascending) {
                    return this.chromosomes.sort((a, b) => (a.size_in_bp > b.size_in_bp) ? 1 : -1)
                } else {
                    return this.chromosomes.sort((a, b) => (a.size_in_bp > b.size_in_bp) ? -1 : 1)
                }

                break;
            default:
                console.log('Invalid sorting method for chromosme: ' + this.api.settings.sorting_chromosome)
                return this.chromosomes
        }

    }

    compute_xscale(range) {

        var max = 0

        for (const chrKey in this.chromosomes) {
            var chr = this.chromosomes[chrKey]

            if (chr.size_in_bp > max) {
                max = chr.size_in_bp
            }
        }

        this.xscale = d3.scaleLinear()
            .domain([0, max])
            .range(range)


    }

}


class Chromosome {

    constructor() {

        this.name = null
        this.genes = []
        this.links = []
        this.unique_id = uid_chr++
        this.div_main = null
        this.div_overview = null
        this.svg_overview = null
        this.div_excerpt = null

        this.size_in_bp = 0


    }

    compute_size_in_bp(){

        var max = 0

        for (const geneKey in this.genes) {
            var gene = this.genes[geneKey]

            if (gene.end > max) {
                max = gene.end
            }
        }

        this.size_in_bp = max
    }

}


