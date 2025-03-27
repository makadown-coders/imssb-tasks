
/**
 * Esta función toma un error desconocido `err` y devuelve un mensaje de error de cadena. 
 * Si `err` es una instancia de la clase `Error`, devuelve el mensaje de error (`err.message`). 
 * De lo contrario, convierte `err` en una cadena mediante la función `String()`.
 * @param err 
 * @returns 
 */
export const getErrorMessage = ( err: unknown ) => err instanceof Error ? err.message : String(err);