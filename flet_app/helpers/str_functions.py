def add_dots(numero):
    """
    Función que agrega puntos de mil a un número dado.
    
    Args:
    numero (int): El número al que se le añadirán los puntos de mil.
    
    Returns:
    str: El número con los puntos de mil añadidos como string.
    """
    numero_formateado = "{:,.0f}".format(numero).replace(",", ".")
    return numero_formateado

