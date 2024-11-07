import React, { useState } from 'react';
import { Button, Intent } from '@blueprintjs/core';

type GPUGridProps = {
  gpus: string[];
  reservations: Reservation[];
  currentCustomer: Customer | null;
  isWeekView: boolean;
  onReserve: (selectedGpuIds: number[]) => void;
};

type Reservation = {
  id: number;
  customer: string;
  startDate: string;
  endDate: string;
  gpuId: number;
  color: string;
};

type Customer = {
  id: number;
  name: string;
  color: string;
};

const GPUGrid: React.FC<GPUGridProps> = ({
  gpus,
  reservations,
  currentCustomer,
  isWeekView,
  onReserve
}) => {
  const [selectedGpuIds, setSelectedGpuIds] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown = (gpuId: number) => {
    setIsDragging(true);
    toggleSelection(gpuId);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = (gpuId: number) => {
    if (isDragging) {
      toggleSelection(gpuId);
    }
  };

  const toggleSelection = (gpuId: number) => {
    if (!currentCustomer) return;

    const isReservedByCustomer1 = reservations.some(res => res.gpuId === gpuId && res.color === 'blue');
    if (currentCustomer.name === 'Customer-2' && isReservedByCustomer1) {
      return;
    }

    setSelectedGpuIds(prev =>
      prev.includes(gpuId) ? prev.filter(id => id !== gpuId) : [...prev, gpuId]
    );
  };

  const handleReserveClick = () => {
    onReserve(selectedGpuIds);
    setSelectedGpuIds([]);
  };

  const renderCell = (gpu: string, index: number) => {
    const gpuId = index + 1;
    const reservation = reservations.find(res => res.gpuId === gpuId);
    const isSelected = selectedGpuIds.includes(gpuId);

    let cellColor = 'bg-gray-200'; // Default color
    if (reservation) {
      cellColor = reservation.color === 'blue' ? 'bg-blue-500' : 'bg-red-500';
    } else if (isSelected) {
      cellColor = currentCustomer?.color === 'blue' ? 'bg-blue-300' : 'bg-red-300';
    }

    return (
      <div
        key={gpuId}
        className={`border p-4 cursor-pointer ${cellColor} flex items-center justify-center`}
        onMouseDown={() => handleMouseDown(gpuId)}
        onMouseEnter={() => handleMouseEnter(gpuId)}
        onMouseUp={handleMouseUp}
      >
        {gpu}
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-2" onMouseLeave={handleMouseUp}>
        {gpus.map(renderCell)}
      </div>
      <Button
        intent={currentCustomer?.color === 'blue' ? Intent.SUCCESS : Intent.DANGER}
        onClick={handleReserveClick}
        disabled={selectedGpuIds.length === 0}
        className="mt-4 w-full"
      >
        Buy
      </Button>
    </div>
  );
};

export default GPUGrid;