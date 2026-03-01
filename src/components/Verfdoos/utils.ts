export const exportVerfdoosImage = (
  bgCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  fgCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  isDarkMode: boolean
) => {
  const exportCanvas = document.createElement('canvas');
  const bgCanvas = bgCanvasRef.current;
  const fgCanvas = fgCanvasRef.current;
  if (!bgCanvas || !fgCanvas) return;

  const width = 1200;
  const height = 630;
  exportCanvas.width = width;
  exportCanvas.height = height;
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = isDarkMode ? '#1a1a1a' : '#fdfbf7';
  ctx.fillRect(0, 0, width, height);

  ctx.font = "800 170px 'Nunito', sans-serif";
  const textString = "Kaliber";
  const textWidth = ctx.measureText(textString).width;

  const logoSize = 440;
  const gap = 70;

  const totalWidth = logoSize + gap + textWidth;
  const startX = (width - totalWidth) / 2;
  const logoY = (height - logoSize) / 2;

  ctx.drawImage(bgCanvas, startX, logoY, logoSize, logoSize);
  ctx.drawImage(fgCanvas, startX, logoY, logoSize, logoSize);

  ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#122222';
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(textString, startX + logoSize + gap, height / 2 + 15);

  const dataUrl = exportCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'tommys-verfdoos-kunstwerk.png';
  link.href = dataUrl;
  link.click();
};
