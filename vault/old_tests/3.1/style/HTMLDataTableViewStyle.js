let HTMLCSSStyle = document.createElement('style');

HTMLCSSStyle.textContent = 
`table 
{
	border: 1px solid #7F7F7F;
    background-color: #FFFFFF;
    font-family: arial;
    font-size: 12px;
    border-collapse: collapse;
    width: 100%;   
}

td
{
	border: 1px solid #D0D0D0;
    text-align: center;
    border-collapse: collapse;
}

th
{
	background-color: #7F7F7F;
	color: white;
}

tr
{
	cursor: default;
}

tr:nth-child(even)
{
	background-color: #FBFBFB
}

tr:hover
{
	color: black;
	background-color: #F1F1F1;
	transition: 0.2s;
}`

export {HTMLCSSStyle};