import * as d3 from 'd3';

export default class Viewer {

    constructor(div_id) {

        this.api = null
        this.model = null
        this.controller = null

        this.container_id = div_id
        this.dom_container = document.getElementById(this.container_id)
        this.d3_container = d3.select(this.dom_container)

        this.color_scale = null

    }

    render(){

        //this.add_interface_settings()

        this.compute_global_color_scale()

        this.add_interface_container_chromosomes()

        this.add_interface_small_container_chromosome()


    }

    add_interface_settings(){

        this.interface_settings = this.d3_container.append("div")
            .attr("id", "interface_settings")

        this.interface_settings_header = this.interface_settings.append('div').attr("id", "interface_header")

        this.interface_settings_filters = this.interface_settings.append('div').attr("id", "interface_filters")
            .style("background-color","#dddddd")
            .style('margin', '12px')
            .style('display', 'none')
            .style('height', '100px')


        this.interface_settings_header.append("button")

            .html("Toggle filter")
            .on("click", () => {
                if (this.interface_settings_filters.style('display') == 'none'){
                    this.interface_settings_filters.style('display', 'block')
                }
                else{
                    this.interface_settings_filters.style('display', 'none')
                }

            });

    }

    add_interface_container_chromosomes(){

        this.interface_container_chromosome = this.d3_container.append("div")
            .attr("id", "interface_chr_container")
            .style('margin', '4px')
            .style("background-color","#C133F2")
    }

    add_interface_small_container_chromosome(){

        this.interface_small_containers_chromosome = []

        var sorted_chromosomes = this.model.sorted_chromosome(false)

        for (const argumentsKey in sorted_chromosomes) {

            var chr = sorted_chromosomes[argumentsKey]

            var item = this.d3_container.append("div")
                .attr("id", "interface_chr_small_container" + chr.unique_id )
                .style('margin', '48px')

            this.add_chromosome_viewer_core(item,chr)

            this.interface_small_containers_chromosome.push(item)

        }

        this.model.compute_xscale([0, item.node().getBoundingClientRect().width])

        this.update_all_chromosomes_viewer()


    }

    update_all_chromosomes_viewer(){

            for (const chrKey in this.model.chromosomes) {

                var chr = this.model.chromosomes[chrKey]

                this.update_chromosome_viewer(chr)

            }
    }

    update_chromosome_viewer(chr_data){

        this.update_chromosome_viewer_overview(chr_data)
        this.update_chromosome_viewer_excerpt(chr_data, null)

    }

    update_chromosome_viewer_overview(chr_data){

            var that = this;

            var width = chr_data.div_overview.node().getBoundingClientRect().width
            var height = chr_data.div_overview.node().getBoundingClientRect().height

            chr_data.svg_overview
                .attr("viewBox", [0, 0, width, height])


            chr_data.svg_overview.append("g").append('text')
                .attr('x', 10)
                .attr('y', 20)
                .text(this.format_chromosome_name(chr_data))
                .style('font-size', '18px')
                .style('fill', 'black')
                .style('font-weight', 'bold')

            chr_data.svg_overview.append("g").append('text')
                .attr('x', width)
                .attr('y', 20)
                .attr('text-anchor', 'end')
                .text(this.format_chromosome_genes(chr_data))
                .style('font-size', '14px')
                .style('fill', 'grey')
                .style('font-weight', 'bold')

            var x = this.model.xscale

            var rectangles = chr_data.svg_overview.selectAll('rect')
                .data(chr_data.genes)
                .join('rect')
                .attr('x', d => x(d.start))
                .attr('y', 40)
                .attr('width', d => x(d.end) - x(d.start))
                .attr('height', height)
                .attr('fill', d => {
                    return this.color_scale(d.color)
                })



            var brush = d3.brushX()
                .extent([[0,30], [width, height ]])
                .on("start brush end", brushed)

        chr_data.svg_overview.append("g")
            .call(brush)








            function brushed(event) {
                const selection = event.selection;
                if (selection === null) {
                    rectangles.attr("fill", (d) => that.color_scale(d.color));
                    chr_data.div_excerpt.style('display', 'none')
                } else {
                    const [x0, x1] = selection.map(x.invert);
                    rectangles.attr("fill", (d) => {
                        return x0 <= d.end && d.start <= x1 ? "red" : that.color_scale(d.color)
                    });
                    chr_data.div_excerpt.style('display', 'block')
                    that.update_chromosome_viewer_excerpt(chr_data, [x0, x1]);
                }

                chr_data.svg_overview.selectAll(".handle").attr('d', brushResizePath);



            }






    }

    update_chromosome_viewer_excerpt(chr_data,domain){

        if (domain == null){return}

            var width = chr_data.div_overview.node().getBoundingClientRect().width
            var height = 80;

            chr_data.svg_excerpt
                .attr("viewBox", [0, 0, width, height])

            var x_cerpt =  d3.scaleLinear()
                .domain(domain)
                .range([0, width])

            chr_data.svg_excerpt.selectAll('rect')
                .data(chr_data.genes)
                .join('rect')
                .attr('x', d => x_cerpt(d.start))
                .attr('y', 0)
                .attr('width', d => x_cerpt(d.end) - x_cerpt(d.start))
                .attr('height', height)
                .style('fill', (d) => this.color_scale(d.color))
    }

    add_chromosome_viewer_core(div_chr, chr_data ){

        chr_data.div = div_chr

        chr_data.div_overview = chr_data.div.append("div").attr("id", "interface_chr_overview" + chr_data.unique_id )
        chr_data.div_excerpt = chr_data.div.append("div").attr("id", "interface_chr_excerpt" + chr_data.unique_id ).style('display', 'none')

        // get the width and height of the container
        var width = div_chr.node().getBoundingClientRect().width

        chr_data.svg_overview =  chr_data.div_overview.append("svg")
            .attr("viewBox", [0, 0, width, 100])
            .attr('id', 'chr_svg_overview_' + chr_data.unique_id)



        chr_data.svg_excerpt =  chr_data.div_excerpt.append("svg")
            .attr("viewBox", [0, 0, width, 100])
            .attr('id', 'chr_svg_excerpt_' + chr_data.unique_id)


    }

    compute_global_color_scale(){ this.color_scale = d3.scaleLinear([-1, 1], ["salmon", "LightGreen"])}

    format_chromosome_name(chr){

        // return chromosome with name if it is a number otherwise print as if it is a string
        if (!isNaN(chr.name) || ['X', 'Y', 'MT'].includes(chr.name) ){return "Chromosome " + chr.name}
        else{return chr.name}


    }

    format_chromosome_genes(chr){

            return chr.genes.length + " genes - " + d3.format(",.9r")(parseInt(chr.size_in_bp))  + " bp"
    }



}