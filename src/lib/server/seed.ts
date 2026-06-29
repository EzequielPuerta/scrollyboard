import { getDb } from './db';
import type { ScrollyDoc } from '$lib/types/scrolly';

const sampleData = `year,month,value
1940,1,11.46
1940,2,12.03
1940,3,12.89
1941,1,11.22
1941,2,11.98
1941,3,13.05
2023,1,12.67
2023,2,13.45
2023,3,14.12
2024,1,13.89`;

const sample1: ScrollyDoc = {
	title: 'Temperatura Global de la Superficie',
	description: 'Un análisis de la variación de temperaturas globales mensuales desde 1940.',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	components: [
		{
			type: 'scene',
			layout: 'side-by-side',
			layoutProps: {
				inverted: false,
				gridColumns: '1fr 3fr',
				offsetTop: '0px',
				offsetBottom: '0px'
			},
			data: {
				kind: 'chart',
				chartType: 'line',
				variant: 'chart',
				csvData: sampleData,
				x: 'year',
				y: 'value',
				title: 'Temperatura Promedio Mensual',
				subtitle: 'Datos desde 1940 hasta 2024',
				caption: 'Fuente: datos climáticos globales'
			},
			steps: [
				{
					id: '1',
					text: 'Este gráfico muestra la temperatura promedio mensual de la superficie terrestre desde 1940.'
				},
				{
					id: '2',
					text: 'Se puede observar una tendencia de aumento de temperatura a lo largo del tiempo.',
					showData: true
				},
				{
					id: '3',
					text: 'Este cambio climático es uno de los desafíos más importantes del siglo XXI.'
				}
			]
		}
	]
};

const sample2: ScrollyDoc = {
	title: 'Historia con Datos Visuales',
	description: 'Una narrativa con visualizaciones que cambian a medida que scrolleas.',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	components: [
		{
			type: 'hero',
			title: 'Descubre la Historia',
			subtitle: 'A través de datos y visualizaciones',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
		},
		{
			type: 'paragraph',
			content: 'Los datos nos permiten contar historias complejas de una manera clara y accesible.'
		},
		{
			type: 'scene',
			layout: 'overlay',
			layoutProps: {
				offsetTop: '0px',
				offsetBottom: '0px'
			},
			data: {
				kind: 'text',
				content: 'Durante miles de años, el clima ha sido relativamente estable.'
			},
			steps: [
				{
					id: '1',
					text: 'Pero en los últimos 150 años, ha habido cambios significativos.'
				},
				{
					id: '2',
					text: 'Estos cambios están correlacionados con la actividad humana.'
				}
			]
		},
		{
			type: 'footer',
			columns: [
				{
					heading: 'Acerca de',
					text: 'Este proyecto es una demostración del editor WYSIWYG de scrollytelling.'
				},
				{
					heading: 'Contacto',
					text: 'Para más información, visita el repositorio del proyecto.'
				}
			]
		}
	]
};

const sample3: ScrollyDoc = {
	title: 'Presentación con Diapositivas',
	description: 'Una experiencia de diapositivas completas con datos interactivos.',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	components: [
		{
			type: 'navbar',
			title: 'Scrollyboard Editor',
			links: [
				{ label: 'Inicio', href: '/' },
				{ label: 'Docs', href: '#' }
			]
		},
		{
			type: 'scene',
			layout: 'slide',
			layoutProps: {
				offsetTop: '0px',
				dvhHeightPerStep: 100,
				transition: { enter: { preset: 'fade' } }
			},
			data: {
				kind: 'text',
				content: 'El cambio climático es un hecho científico confirmado.'
			},
			steps: [
				{
					id: '1',
					text: 'Diapositiva 1: Introducción al cambio climático'
				},
				{
					id: '2',
					text: 'Diapositiva 2: Datos históricos',
					showData: true
				},
				{
					id: '3',
					text: 'Diapositiva 3: Impactos globales',
					showData: 'force-refresh'
				},
				{
					id: '4',
					text: 'Diapositiva 4: Conclusiones y llamado a la acción'
				}
			]
		},
		{
			type: 'footer',
			columns: [
				{
					heading: 'Datos',
					text: 'Todos los datos utilizados son de fuentes públicas verificadas.'
				},
				{
					heading: 'Tecnología',
					text: 'Construido con SvelteKit y bibliotecas de scrollytelling.'
				}
			]
		}
	]
};

export async function seedDatabase() {
	try {
		const db = await getDb();
		const collection = db.collection('scrollies');

		const count = await collection.countDocuments();
		if (count === 0) {
			console.log('Seeding database with sample scrollies...');
			await collection.insertMany([sample1, sample2, sample3] as any[]);
			console.log('Database seeded successfully.');
		}
	} catch (error) {
		console.error('Error seeding database:', error);
	}
}
