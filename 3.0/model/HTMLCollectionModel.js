import {uuid} from '../lib/uuid.js';

class HTMLValueModel
{
	constructor( parentEventTarget, value )
	{
		this.__value__ = value;
		this.__parent__ = parentEventTarget;
	}

	get value()
	{
		return this.__value__;
	}

	set value(newValue)
	{
		if ( this.__value__ != newValue )
		{
			this.__value__ = newValue;
			this.__parent__.dispatchEvent('change',{ detail:newValue});
		}
	}
}

class HTMLRowItemModel
{
	constructor( parentModel )
	{

	}

	isSelected()
	{

	}

	select()
	{

	}

	unselect()
	{

	}
}

class HTMLCollectionModel extends EventTarget
{
	constructor()
	{
		super();
		this.data = new Array();
		this.header = new Array();
	}

	

	insert( dataObject, index, id = uuid() )
	{
		let success = false;

		let object = { value: dataObject, selected: false, id: id };
		
		if( index == undefined || index == null )
		{
			this.data.push( object );
			success = true;
		}
		else if( index >= 0 || index <= this.data.length )
		{
			this.data.splice( index, 0, object );
			success = true;
		}
		

		if ( success )
		{
			//console.log('model says: '+id+' was inserted');
			this.dispatchEvent( new CustomEvent('insert', { detail:{ id:id } }) );
		}
		else
			console.error('IndexSizeError: Index or size is negative or greater than the allowed amount');

		return this.data.length;
	}

	update( dataObject, index )
	{
		if ( index >= 0 && index < this.data.length )
		{
			this.getObjectByIndex( index ).value = dataObject;
			this.dispatchEvent( new CustomEvent('update', { detail:{ id:this.getObjectByIndex( index ).id } }) );
		}
	}

	get length()
	{
		return this.data.length;
	}

	delete( index )
	{
		if ( index >= 0 && index < this.length )
		{
			let object = this.data.splice( index, 1 );
			console.log('model says that object id='+object.id+' was deleted');
			this.dispatchEvent( new CustomEvent('delete', { detail:{ id:object[0].id } }) );
		}
	}

	clear()
	{
		this.data = [];
		this.dispatchEvent( new CustomEvent('empty') );
	}

	isEmpty()
	{
		return (this.data.length == 0);
	}

	getObjectByid( id )
	{
		return this.data.find( item => item.id==id );
	}

	getIndexByid( id )
	{
		return this.data.findIndex( item => item.id==id );
	}

	getObjectByIndex( index )
	{
		return ( index >= 0 && index < this.data.length )? this.data[index] : null;
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
		for(item of this.data)
		{
			callback(item);
		}
	}
}

//export module
export { HTMLCollectionModel };