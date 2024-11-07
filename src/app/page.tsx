import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Zoom } from '@visx/zoom';
import { RectClipPath } from '@visx/clip-path';
import { Group } from '@visx/group';
import { localPoint } from '@visx/event';
import axios from 'axios';

// Set Axios base URL to Express server
axios.defaults.baseURL = 'http://localhost:4000';

const customers = ['Customer #1', 'Customer #2', 'Customer #3', 'Customer #4'];

type Reservation = {
  id?: number;
  customer: string;
  startDate: string;
  endDate: string;
  gpuIds: string;
};

export default function Home() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [days, setDays] = useState<number>(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);

}