export interface Vuelo {
  id: number;
  origen: string;
  destino: string;
  hora_salida: Date;
  hora_llegada: Date;
  aerolinea: string;
}