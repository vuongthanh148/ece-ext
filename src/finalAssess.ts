export function calculateSkillAverage(skillName: string): void {
  console.log("Calculating average for skill:", skillName);
  // Find all tr-skill rows
  const skillRows: NodeListOf<HTMLTableRowElement> = document.querySelectorAll('tr.tr-skill');
  let targetRow: HTMLTableRowElement | null = null;

  // Find the row with the specified skill name
  for (const row of Array.from(skillRows)) {
    const rowSkillName: string = row.querySelector('td.col-sticky div')?.textContent?.trim() || '';
    if (rowSkillName === skillName) {
      targetRow = row;
      break;
    }
  }

  if (!targetRow) {
    console.warn(`Skill row not found for: ${skillName}`);
    return;
  }

  // Get all rows after target row until next tr-skill
  const rows: HTMLTableRowElement[] = [];
  let nextRow: HTMLTableRowElement | null = targetRow.nextElementSibling as HTMLTableRowElement | null;
  while (nextRow && !nextRow.classList.contains('tr-skill')) {
    rows.push(nextRow);
    nextRow = nextRow.nextElementSibling as HTMLTableRowElement | null;
  }

  // Get all td columns in target row (skip first col-sticky)
  const columns: HTMLTableCellElement[] = Array.from(targetRow.querySelectorAll('td')).slice(1);

  // Process each column
  columns.forEach((col: HTMLTableCellElement, colIndex: number) => {
    let sum: number = 0;
    let count: number = 0;

    // For each row in the same column
    rows.forEach((row: HTMLTableRowElement) => {
      const cell: HTMLTableCellElement | null = row.querySelectorAll('td')[colIndex + 1]; // +1 to skip col-sticky
      if (cell && cell.classList.contains('td-input')) {
        const inputs: NodeListOf<HTMLInputElement> = cell.querySelectorAll('input');
        let cellSum: number = 0;
        let cellCount: number = 0;

        // Process inputs in the cell
        inputs.forEach((input: HTMLInputElement) => {
          const value: number = parseFloat(input.value);
          if (!isNaN(value)) {
            cellSum += value;
            cellCount++;
          }
        });

        // If there are inputs, calculate average for this cell
        if (cellCount > 0) {
          sum += cellSum / cellCount;
          count++;
        }
      }
    });

    // Calculate overall average for this column
    if (count > 0) {
      const average = (sum / count);
      // Update skill-point value
      const skillPoint: HTMLElement | null = col.querySelector('.skill-point .value');
      if (skillPoint) {
        console.log(`Updating skill point for column ${colIndex + 1} with average:`, average);
        const currentValue: string = skillPoint.textContent?.trim() || '';
        skillPoint.setAttribute('data-original-value', currentValue); // Store original value
        skillPoint.textContent = `${currentValue} (${average})`;
      }
    }
  });
}
