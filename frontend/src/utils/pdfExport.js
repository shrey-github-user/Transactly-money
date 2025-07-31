import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (transactions, type) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`${type === 'income' ? 'Income' : 'Expense'} Report`, 20, 30);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
  
  // Prepare table data
  const tableData = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(transaction => [
      new Date(transaction.date).toLocaleDateString(),
      transaction.category,
      `Rs.${transaction.amount.toFixed(2)}`,
      transaction.description || '-'
    ]);
  
  // Add table
  doc.autoTable({
    head: [['Date', 'Category', 'Amount', 'Description']],
    body: tableData,
    startY: 50,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: type === 'income' ? [16, 185, 129] : [239, 68, 68],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });
  
  // Add total
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const finalY = doc.lastAutoTable.finalY + 20;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total ${type === 'income' ? 'Income' : 'Expenses'}: Rs.${total.toFixed(2)}`, 20, finalY);
  
  // Save the PDF
  doc.save(`${type}-report-${new Date().toISOString().split('T')[0]}.pdf`);
};