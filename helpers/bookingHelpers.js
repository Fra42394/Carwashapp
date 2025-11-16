import { doc, collection, runTransaction, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

/**
 * createBookingAtomic: rimuove lo slot dal documento service e crea booking in transazione
 * @param {string} serviceId - ID del servizio
 * @param {string} slotISO - Slot in formato ISO string
 * @param {string} address - Indirizzo del cliente
 * @returns {Promise<{bookingId: string}>}
 */
export async function createBookingAtomic(serviceId, slotISO, address = "") {
  const serviceRef = doc(db, "services", serviceId);
  const bookingsRef = collection(db, "bookings");

  return await runTransaction(db, async (transaction) => {
    // Leggi il servizio
    const serviceSnap = await transaction.get(serviceRef);
    if (!serviceSnap.exists()) {
      throw new Error("Servizio non trovato");
    }

    // Verifica disponibilità dello slot
    const serviceData = serviceSnap.data();
    const slots = Array.isArray(serviceData.availableSlots) 
      ? [...serviceData.availableSlots] 
      : [];
    
    const slotIndex = slots.indexOf(slotISO);
    if (slotIndex === -1) {
      throw new Error("Slot non più disponibile");
    }

    // Rimuovi lo slot prenotato
    slots.splice(slotIndex, 1);
    transaction.update(serviceRef, { availableSlots: slots });

    // Crea la prenotazione
    const newBookingRef = doc(bookingsRef);
    const bookingData = {
      userId: auth.currentUser.uid,
      serviceId: serviceId,
      serviceName: serviceData.name || "Servizio",
      datetime: new Date(slotISO),
      address: address.trim(),
      status: "confirmed",
      paymentStatus: "pending",
      createdAt: serverTimestamp()
    };
    
    transaction.set(newBookingRef, bookingData);

    return { bookingId: newBookingRef.id };
  });
}