import {HTMLCollectionModel} from '../model/HTMLCollectionModel.js';
import {HTMLDataTableView} from '../view/HTMLDataTableView.js';

class HTMLDataTable extends HTMLElement
{
	constructor( HTMLDataModel = HTMLCollectionModel, HTMLView = HTMLDataTableView )
	{
		super();

		this.innerModel = new HTMLDataModel();
		this.innerDOM = new HTMLView();

		this.attachShadow({ mode: 'open' });		

		//model-handler-binding
		this.__oninsert__ = event => this.oninsert(event);
		this.__onupdate__ = event => this.onupdate(event);
		this.__onselect__ = event => this.onselect(event);
		this.__onunselect__ = event => this.onunselect(event);
		this.__ondelete__ = event => this.ondelete(event);
		this.__onreload__ = event => this.onreload(event);
		this.__onempty__ = event => this.onempty(event);

		//connections
		this.innerModel.addEventListener('insert', this.__oninsert__ );
        this.innerModel.addEventListener('update', this.__onupdate__ );
        this.innerModel.addEventListener('delete', this.__ondelete__ );
        this.innerModel.addEventListener('reload', this.__onreload__ );
        this.innerModel.addEventListener('empty', this.__onempty__);


	}

	//model event handlers
	oninsert(event)
	{
		let index = this.innerModel.getIndexByid(event.detail.id);
		let data = this.innerModel.getObjectByid(event.detail.id);

		this.innerDOM.insert(data,index,event.detail.id)
	}

	onupdate(event)
	{
		this.innerDOM.update( this.innerModel.getObjectByid(event.detail.id), event.detail.id );
	}

	ondelete(event)
	{
		this.innerDOM.delete( event.detail.id);
	}

	onempty(event)
	{
		this.innerDOM.showEmpty();
	}

	//view event handlers
	onselect(event)
	{
		this.innerModel.select( this.innerModel.getIndexByid(event.detail.id));
	}

	onunselect(event)
	{
		this.innerModel.unselect( this.innerModel.getIndexByid(event.detail.id));
	}

	//web component api implementation
	connectedCallback() 
	{
		this.innerDOM.addEventListener('select', this.__onselect__ );
        this.innerDOM.addEventListener('unselect', this.__onunselect__);

		this.shadowRoot.appendChild( this.innerDOM );
    }

    adoptedCallback()
    {

    }

    disconnectedCallback()
    {
    	
    }

    attributeChangedCallback(attrName, oldVal, newVal)
    {

    }

    static get observedAttributes() 
    {
    	return [];
	}

	
}

//registration requeriment
customElements.define('x-datatable', HTMLDataTable );

//export module
export { HTMLDataTable };