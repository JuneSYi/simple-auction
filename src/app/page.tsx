"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Button,
  ButtonGroup,
  InputGroup,
  Card,
  Elevation,
  Switch,
  Intent,
  OverlayToaster,
  Position
} from '@blueprintjs/core';
import { DateInput3 } from '@blueprintjs/datetime2';
import 'react-datepicker/dist/react-datepicker.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format, addDays } from 'date-fns';
import GPUGrid from '../components/GPUGrid';
import useStore from '../store/useStore';

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

const customers: Customer[] = [
  { id: 1, name: 'Customer-1', color: 'blue' },
  { id: 2, name: 'Customer-2', color: 'red' },
];

const gpuList = Array.from({ length: 10 }, (_, i) => `GPU-${i + 1}`);

export default function Home() {
  const { reservations, setReservations, selectedCustomer, setSelectedCustomer } = useStore();
  const [isWeekView, setIsWeekView] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [days, setDays] = useState<number>(1);
  const toasterRef = useRef<OverlayToaster>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleView = () => {
    setIsWeekView(prev => !prev);
  };

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Reservation[]>('http://localhost:5000/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toasterRef.current?.show({ message: 'Error fetching reservations', intent: Intent.DANGER });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = async (selectedGpuIds: number[]) => {
    if (!selectedCustomer || !startDate) {
      toasterRef.current?.show({ message: 'Please select a customer and start date', intent: Intent.WARNING });
      return;
    }

    const calculatedEndDate = addDays(startDate, days);
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reservations', {
        customer: selectedCustomer.name,
        startDate: format(startDate, 'MM/dd/yyyy'),
        endDate: format(calculatedEndDate, 'MM/dd/yyyy'),
        gpuIds: selectedGpuIds,
        color: selectedCustomer.color,
      });
      toasterRef.current?.show({ message: 'Reservation successful', intent: Intent.SUCCESS });
      fetchReservations();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toasterRef.current?.show({ message: 'Conflicting reservation', intent: Intent.DANGER });
      } else {
        toasterRef.current?.show({ message: 'Error creating reservation', intent: Intent.DANGER });
      }
      console.error('Error creating reservation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="bp3-heading text-2xl mb-4">GPU Reservation System</h1>

        {/* Customer Selection */}
        <ButtonGroup>
          {customers.map((customer) => (
            <Button
              key={customer.id}
              intent={selectedCustomer?.id === customer.id ? Intent.PRIMARY : Intent.NONE}
              onClick={() => setSelectedCustomer(customer)}
            >
              {customer.name}
            </Button>
          ))}
        </ButtonGroup>

        {/* Toggle for Days/Weeks */}
        <div className="mt-4">
          <Switch
            label="Week View"
            checked={isWeekView}
            onChange={toggleView}
            className="bp3-large"
          />
        </div>

        {/* Date Selection */}
        <Card elevation={Elevation.TWO} className="mt-4 p-4">
          <div className="flex space-x-4">
            <DateInput3
              value={startDate ? format(startDate, 'MM/dd/yyyy') : ''}
              onChange={(date: string | null) => setStartDate(date ? new Date(date) : null)}
              formatDate={(date: Date) => format(date, 'MM/dd/yyyy')}
              parseDate={(str: string) => new Date(str)}
              placeholder="Start Date (MM/DD/YYYY)"
              className="bp3-input bp3-fill"
            />
            <InputGroup
              placeholder="Number of Days"
              type="number"
              value={days.toString()}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bp3-input bp3-fill"
            />
          </div>
          {startDate && (
            <div className="mt-2">
              <span>End Date: {format(addDays(startDate, days), 'MM/dd/yyyy')}</span>
            </div>
          )}
        </Card>

        {/* Loading Indicator */}
        {isLoading && <div className="mt-4">Loading...</div>}

        {/* GPU Grid */}
        <div className="mt-4">
          <GPUGrid
            gpus={gpuList}
            reservations={reservations}
            currentCustomer={selectedCustomer}
            isWeekView={isWeekView}
            onReserve={handleReserve}
          />
        </div>

        {/* Toaster */}
        <OverlayToaster ref={toasterRef} position={Position.TOP_RIGHT} />
      </div>
    </DndProvider>
  );
}