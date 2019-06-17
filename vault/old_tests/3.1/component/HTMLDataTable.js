import {HTMLCollectionModel} from '../model/HTMLCollectionModel.js';

class Column
{
	constructor()
	{
		this.id = 1;
		this.name = 'default-column';
		this.contentDataType = String;
		this.contentFormat = input => input;
		this.columnType = 'action';
	}
}

class HTMLDataTable extends HTMLElement
{
	constructor( HTMLDataModel = HTMLCollectionModel )
	{
		super();

		if ( HTMLDataModel != undefined && HTMLDataModel != null )
		{
			this.__value__ = new HTMLDataModel();
		}		

		this.attachShadow({ mode: 'open' });

		this.innerDOM = document.createElement('table');
		this.innerDOM.createTBody();

		//connections
		this.value.addEventListener('insert', eventHandlerFunction => this.oninsert(event) );
        this.value.addEventListener('update', eventHandlerFunction => this.onupdate(event) );
        this.value.addEventListener('delete', eventHandlerFunction => this.ondelete(event) );
        this.value.addEventListener('reload', eventHandlerFunction => this.onreload(event) );
        this.value.addEventListener('empty', eventHandlerFunction => this.onempty(event) );
	}

	get value()
	{
		return this.__value__;
	}

	//model event handlers
	oninsert(event)
	{
		let index = this.value.getIndexByid(event.detail.id);
		let data = this.value.getObjectByid(event.detail.id);

		this.innerDOM.insert(data,index,event.detail.id)
	}

	onupdate(event)
	{
		this.innerDOM.update( this.value.getObjectByid(event.detail.id), event.detail.id );
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
		this.value.select( this.value.getIndexByid(event.detail.id));
	}

	onunselect(event)
	{
		this.value.unselect( this.value.getIndexByid(event.detail.id));
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

	get value()
	{
		return this.__value__;
	}

	insert( data, index, id )
	{
		//console.log('view says that: '+event.detail.id+' contents will be rendered now');

		let row = this.innerDOM.tBodies[0].insertRow(index);
		row.id = id;

		let checkcell = row.insertCell();
		
		row.rowcheck = document.createElement('input');
		row.rowcheck.type = 'checkbox';
		row.rowcheck.name = 'checkbox-select';			
		checkcell.appendChild(row.rowcheck);

		if ( data.selected )
			row.rowcheck.checked = true;

		for( let cellindex = 0; cellindex < data.value.length; cellindex++)
		{
			let cell = row.insertCell();
			cell.innerText = data.value[cellindex].toString();
		}
	}

	update( data, id )
	{
		let row = this.shadowRoot.getElementById(id);

		if ( data.selected )
			row.rowcheck.checked = true;
		else
			row.rowcheck.checked = false;

		for( let cellindex = 0; cellindex < data.length; cellindex++)
		{
			row.children[cellindex+1].innerText = data.value[cellindex].toString();
		}

		console.log('view says that the rendering of object id='+id+' was updated');
	}

	delete(id)
	{
		console.log('view says that the object id='+id+' was deleted from the ui.');
		let row = this.shadowRoot.getElementById( id );
		row.parentElement.removeChild(row);
		
	}

	clear()
	{
		while( this.innerDOM.tBodies[0].childElementCount != 0 )
			this.innerDOM.tBodies[0].deleteRow(0);
	}

	showEmpty()
	{
		this.clear();

		let row = this.innerDOM.tBodies[0].insertRow();
		let cell = row.insertCell();

		cell.innerText = 'No data available in table';
	}

	connectedCallback() 
	{
		//capture checkbox click and forward as a selected/unselected ui-event (more semantic event)
		this.innerDOM.addEventListener('click', (event) =>
		{
			if ( event.target.name == 'checkbox-select' )
			{
				let row = event.target;

				//The parent row <tr> element has the id-binding, so we need to find it to forward to extract and forward it.
				//If you prefeer, you can attach a meta-property on the checkbox element and use it directly without searching.
				while( row.nodeName != 'TR')
					row = row.parentElement;

				if( event.target.checked )
				{
					this.dispatchEvent( new CustomEvent('select', { detail:{id:row.id}} ) );
				}
				else
				{
					this.dispatchEvent( new CustomEvent('unselect', { detail:{id:row.id}} ) );
				}
			}
		});

		this.innerDOM.addEventListener('select', this.onselect );
		this.innerDOM.addEventListener('unselect', this.onunselect );

		//insert dom content

		this.shadowRoot.appendChild( this.innerDOM );
		this.shadowRoot.appendChild(HTMLCSSStyle);
    }

}

//registration requeriment
customElements.define('x-datatable', HTMLDataTable );

//export module
export { HTMLDataTable };