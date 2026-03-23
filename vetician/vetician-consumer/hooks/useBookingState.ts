import { useState, useCallback } from 'react';

export type RoomType = 'standard' | 'private' | 'luxury';

export interface Pet {
  id:     string;
  name:   string;
  breed:  string;
  emoji:  string;
}

export interface Hostel {
  id:       string;
  name:     string;
  rating:   number;
  distance: string;
  price:    number;
  emoji:    string;
  rooms:    number;
}

export interface Room {
  id:          RoomType;
  name:        string;
  description: string;
  price:       number;
  emoji:       string;
}

export interface BookingState {
  selectedPet:    Pet | null;
  selectedHostel: Hostel | null;
  selectedRoom:   Room | null;
  checkin:        Date;
  checkout:       Date;
}

const defaultCheckin  = new Date('2026-03-20');
const defaultCheckout = new Date('2026-03-23');

export function useBookingState() {
  const [booking, setBooking] = useState<BookingState>({
    selectedPet:    null,
    selectedHostel: null,
    selectedRoom:   null,
    checkin:        defaultCheckin,
    checkout:       defaultCheckout,
  });

  const selectPet = useCallback((pet: Pet) => {
    setBooking(prev => ({ ...prev, selectedPet: pet }));
  }, []);

  const selectHostel = useCallback((hostel: Hostel) => {
    setBooking(prev => ({ ...prev, selectedHostel: hostel }));
  }, []);

  const selectRoom = useCallback((room: Room) => {
    setBooking(prev => ({ ...prev, selectedRoom: room }));
  }, []);

  const setCheckin = useCallback((date: Date) => {
    setBooking(prev => {
      const checkout = date >= prev.checkout
        ? new Date(date.getTime() + 86400000)
        : prev.checkout;
      return { ...prev, checkin: date, checkout };
    });
  }, []);

  const setCheckout = useCallback((date: Date) => {
    setBooking(prev => ({ ...prev, checkout: date }));
  }, []);

  const nights = Math.max(
    1,
    Math.round(
      (booking.checkout.getTime() - booking.checkin.getTime()) / 86400000
    )
  );

  const totalPrice = (booking.selectedRoom?.price ?? 0) * nights;

  const isReady =
    !!booking.selectedPet &&
    !!booking.selectedHostel &&
    !!booking.selectedRoom;

  return {
    booking,
    nights,
    totalPrice,
    isReady,
    selectPet,
    selectHostel,
    selectRoom,
    setCheckin,
    setCheckout,
  };
}
