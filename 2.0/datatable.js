import {uuid} from './uuid.js';

class HTMLDataTable extends HTMLElement
{
	constructor( )
	{
		super();

		//validation

		//instances (read attributes first if not defined use defaults)
		this.innerModel = new Array();
		this.innerDOM = document.createElement('table');
		this.innerDOM.createTBody();

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
		this.addEventListener('insert', this.__oninsert__ );
        this.addEventListener('update', this.__onupdate__ );
        this.addEventListener('select', this.__onselect__ );
        this.addEventListener('unselect', this.__onunselect__ );
        this.addEventListener('delete', this.__ondelete__ );
        this.addEventListener('reload', this.__onreload__ );
        this.addEventListener('empty', this.__onempty__);
	}

	//model event handlers
	oninsert(event)
	{
		//console.log('view says that: '+event.detail.id+' contents will be rendered now');

		let index = this.getIndexByid(event.detail.id);
		let data = this.getObjectByid(event.detail.id);

		let row = this.innerDOM.tBodies[0].insertRow(index);

		/*binding-section
		The binding section is the relation beetween the model data and its html rendering.
		The binding allows that a modification on the state model reflect visual changes on the user interface, and the opposite. 
		Now i'm using 'id' attribute for binding. Another way is encapsulating the id through dataset api.
		API-Standard --> https://developer.mozilla.org/es/docs/Web/API/HTMLElement/dataset
		For safe bindings, 'id' needs to be unique locally and non-locally. So uuid or similar mechanism is necessary
		to avoid collitions and for safe component distribution.*/

		row.id = event.detail.id;

		let checkcell = row.insertCell();
		
		row.rowcheck = document.createElement('input');
		row.rowcheck.setAttribute('type', 'checkbox');
		row.rowcheck.setAttribute('name', 'checkbox-select');			
		checkcell.appendChild(row.rowcheck);

		if ( data.selected )
			row.rowcheck.checked = true;

		for( let cellindex = 0; cellindex < data.value.length; cellindex++)
		{
			let cell = row.insertCell();
			cell.innerText = data.value[cellindex].toString();
		}
	}

	onupdate(event)
	{
		let row = this.shadowRoot.getElementById( event.detail.id );
		let data = this.getObjectByid( event.detail.id );

		if ( data.selected )
			row.rowcheck.checked = true;
		else
			row.rowcheck.checked = false;

		for( let cellindex = 0; cellindex < data.length; cellindex++)
		{
			row.children[cellindex+1].innerText = data.value[cellindex].toString();
		}

		console.log('view says that the rendering of object id='+event.detail.id+' was updated');
	}

	ondelete(event)
	{
		console.log('view says that the object id='+event.detail.id+' was deleted from the ui.');
		let row = this.shadowRoot.getElementById( event.detail.id );
		row.parentElement.removeChild(row);
		
	}

	onreload(event)
	{
		while( this.innerDOM.tBodies[0].childElementCount != 0 )
				this.innerDOM.tBodies[0].deleteRow(0);

		for( datarow of this.innerModel )
		{
			this.insert(datarow);
		}		
	}

	onempty(event)
	{
		//console.log('view says that object id='+event.detail.id+' wants to be selected');

		while( this.innerDOM.tBodies[0].childElementCount != 0 )
				this.innerDOM.tBodies[0].deleteRow(0);

		let row = this.innerDOM.tBodies[0].insertRow();
		let cell = row.insertCell();

		cell.innerText = 'No data available in table';
	}

	//view event handlers
	onselect(event)
	{
		console.log('view says that object id='+event.detail.id+' wants to be selected');
		this.select( this.getIndexByid(event.detail.id) );
	}

	onunselect(event)
	{
		console.log('view says that object id='+event.detail.id+' wants to be unselected');
		this.unselect( this.getIndexByid(event.detail.id) );
	}

	//web component api implementation
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
    }

    adoptedCallback()
    {

    }

    disconnectedCallback()
    {
    	this.innerDOM.removeEventListener('select', this.onselect );
		this.innerDOM.removeEventListener('unselect', this.onunselect );

		
    }

    attributeChangedCallback(attrName, oldVal, newVal)
    {

    }

    static get observedAttributes() 
    {
    	return [];
	}

	clear()
	{
		while( this.innerDOM.tBodies[0].childElementCount != 0 )
				this.innerDOM.tBodies[0].deleteRow(0);
	}

	insert( dataObject, index, id = uuid() )
	{
		let success = false;

		let object = { value: dataObject, selected: false, id: id };
		
		if( index == undefined || index == null )
		{
			this.innerModel.push( object );
			success = true;
		}
		else if( index >= 0 || index <= this.innerModel.length )
		{
			this.innerModel.splice( index, 0, object );
			success = true;
		}
		

		if ( success )
		{
			//console.log('model says: '+id+' was inserted');
			this.dispatchEvent( new CustomEvent('insert', { detail:{ id:id } }) );
		}
		else
			console.error('IndexSizeError: Index or size is negative or greater than the allowed amount');

		return this.innerModel.length;
	}

	update( dataObject, index )
	{
		if ( index >= 0 && index < this.innerModel.length )
		{
			this.getObjectByIndex( index ).value = dataObject;
			this.dispatchEvent( new CustomEvent('update', { detail:{ id:this.getObjectByIndex( index ).id } }) );
		}
	}

	get length()
	{
		return this.innerModel.length;
	}

	delete( index )
	{
		if ( index >= 0 && index < this.length )
		{
			let object = this.innerModel.splice( index, 1 );
			console.log('model says that object id='+object.id+' was deleted');
			this.dispatchEvent( new CustomEvent('delete', { detail:{ id:object[0].id } }) );
		}
	}

	clear()
	{
		this.innerModel = [];
		this.dispatchEvent( new CustomEvent('empty') );
	}

	isEmpty()
	{
		return (this.innerModel.length == 0);
	}

	getObjectByid( id )
	{
		return this.innerModel.find( item => item.id==id );
	}

	getIndexByid( id )
	{
		return this.innerModel.findIndex( item => item.id==id );
	}

	getObjectByIndex( index )
	{
		return ( index >= 0 && index < this.innerModel.length )? this.innerModel[index] : null;
	}

	select( index )
	{
		let object = this.getObjectByIndex(index);

		if ( object != null )
		{
			object.selected = true;
			console.log('model says that object id='+object.id+' is selected');
			this.dispatchEvent( new CustomEvent('update', { detail:{ id:object.id } }) );
		}
	}

	unselect( index )
	{
		let object = this.getObjectByIndex(index);

		if ( object != null )
		{
			object.selected = false;
			console.log('model says that object id='+object.id+' is unselected');
			this.dispatchEvent( new CustomEvent('update', { detail:{ id:object.id } }) );
		}
	}

	isSelected( index )
	{
		let object = this.getObjectByIndex(index);
		return ( object != null )? object.selected : null;
	}

	forEach( callback )
	{
		for(item of this.innerModel)
		{
			callback(item);
		}
	}
}

//registration requeriment
customElements.define('x-datatable', HTMLDataTable );

//export module
export { HTMLDataTable };