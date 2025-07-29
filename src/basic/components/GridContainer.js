export const createGridContainer = ({ leftColumn, rightColumn }) => {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // 자식 요소들 추가
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  return gridContainer;
};
