class HTMLDataTableView extends HTMLElement
{
	constructor( )
	{
		super();

		this.innerDOM = document.createElement('table');
		this.innerDOM.createTBody();

		this.attachShadow({ mode: 'open' });
	}


	insert( data, index, id )
	{
		//console.log('view says that: '+event.detail.id+' contents will be rendered now');

		let row = this.innerDOM.tBodies[0].insertRow(index);
		row.id = id;

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
customElements.define('x-datatable-view', HTMLDataTableView );

//export module
export { HTMLDataTableView };