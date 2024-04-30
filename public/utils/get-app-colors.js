const allowedColors = [
	{
		main: 'rgb(255, 0, 0)',
		transparent: 'rgba(255, 0, 0, 0.2)',
	},
	{
		main: 'rgb(0, 255, 0)',
		transparent: 'rgba(0, 255, 0, 0.2)',
	},
	{
		main: 'rgb(0, 0, 255)',
		transparent: 'rgba(0, 0, 255, 0.2)',
	},
];
export default function getAppColors() {
	return `<ul class="app-colors">
		${allowedColors
			.map(
				(color) =>
					`<li class="app-colors-item">
				<button class="circle-btn" style="background-color: ${color.transparent}; border-color: ${color.main}"></button>
			</li>`
			)
			.join('')}
	</ul>
	`;
}
