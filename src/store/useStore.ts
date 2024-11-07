import { create } from 'zustand';

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

type State = {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
};

const useStore = create<State>((set) => ({
  reservations: [],
  setReservations: (reservations) => set({ reservations }),
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));

export default useStore; 