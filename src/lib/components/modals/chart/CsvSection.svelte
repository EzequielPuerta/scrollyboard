<script lang="ts">
	import Papa from 'papaparse';
	import type { ChartConfig } from '$lib/chart-config';
	import { csvColumns } from '$lib/chart-config';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	const columns = $derived(csvColumns(config.csvData));
	const rows = $derived.by(() => {
		if (!config.csvData?.trim()) return [];
		return Papa.parse(config.csvData, { header: true, skipEmptyLines: true }).data as Record<
			string,
			string
		>[];
	});

	function onUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			config.csvData = (ev.target?.result as string) ?? '';
		};
		reader.readAsText(file);
	}
</script>

<div class="flex flex-col gap-3">
	<div>
		<label class="label"><span class="label-text font-semibold">Upload CSV</span></label>
		<input
			type="file"
			accept=".csv"
			onchange={onUpload}
			class="file-input file-input-bordered file-input-sm w-full"
		/>
	</div>

	{#if columns.length}
		<div class="text-xs text-success">✓ {columns.length} columns · {rows.length} rows</div>
		<div class="overflow-auto max-h-96 border border-base-300 rounded-lg">
			<table class="table table-xs table-pin-rows">
				<thead>
					<tr>
						<th class="text-base-content/40">#</th>
						{#each columns as c}<th>{c}</th>{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as row, i}
						<tr>
							<td class="text-base-content/40">{i + 1}</td>
							{#each columns as c}<td>{row[c]}</td>{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="alert alert-info text-sm">
			<span>Upload a CSV file to see its columns and rows here.</span>
		</div>
	{/if}
</div>
