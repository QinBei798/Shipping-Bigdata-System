const BASE_VESSELS = [
  { mmsi: '413223190', imo: '9835719', vesselName: 'COSCO SHIPPING PISCES', vesselType: 'Container Ship', departure: 'SHANGHAI', destination: 'ROTTERDAM', eta: '2026-06-15 08:00:00' },
  { mmsi: '235113000', imo: '9436214', vesselName: 'EVER GIVEN', vesselType: 'Container Ship', departure: 'SINGAPORE', destination: 'FELIXSTOWE', eta: '2026-06-08 14:30:00' },
  { mmsi: '311000845', imo: '9743344', vesselName: 'TIAN DU FENG', vesselType: 'Bulk Carrier', departure: 'QINGDAO', destination: 'BUSAN', eta: '2026-05-26 02:00:00' },
  { mmsi: '477852100', imo: '9726491', vesselName: 'OOCL HONG KONG', vesselType: 'Container Ship', departure: 'NINGBO', destination: 'LOS ANGELES', eta: '2026-06-20 10:00:00' },
  { mmsi: '636018500', imo: '9481172', vesselName: 'MSC DIANA', vesselType: 'Container Ship', departure: 'ROTTERDAM', destination: 'SINGAPORE', eta: '2026-06-12 22:00:00' },
  { mmsi: '235114500', imo: '9723456', vesselName: 'CMA CGM JACQUES', vesselType: 'Container Ship', departure: 'HAMBURG', destination: 'SHANGHAI', eta: '2026-06-25 06:00:00' },
  { mmsi: '355678000', imo: '9654321', vesselName: 'MOL TRIUMPH', vesselType: 'Container Ship', departure: 'YOKOHAMA', destination: 'SYDNEY', eta: '2026-06-05 16:00:00' },
  { mmsi: '538007200', imo: '9789012', vesselName: 'STENA IMPERO', vesselType: 'Tanker', departure: 'RAS TANURA', destination: 'ROTTERDAM', eta: '2026-06-18 12:00:00' }
]

const BASE_POSITIONS = [
  { lat: 30.6251, lng: 122.4583, heading: 125, course: 122, speed: 18.5, status: 'Under Way Using Engine', statusCode: 0 },
  { lat: 12.1542, lng: 43.6581, heading: 340, course: 338, speed: 16.2, status: 'Under Way Using Engine', statusCode: 0 },
  { lat: 34.2105, lng: 129.5421, heading: 45, course: 45, speed: 0.1, status: 'At Anchor', statusCode: 1 },
  { lat: 25.1342, lng: 121.7413, heading: 90, course: 88, speed: 14.0, status: 'Under Way Using Engine', statusCode: 0 },
  { lat: 51.8972, lng: 3.6125, heading: 270, course: 272, speed: 20.1, status: 'Under Way Using Engine', statusCode: 0 },
  { lat: 49.0157, lng: -123.1527, heading: 315, course: 310, speed: 11.3, status: 'Moored', statusCode: 2 },
  { lat: 1.2654, lng: 103.8451, heading: 180, course: 178, speed: 22.0, status: 'Under Way Using Engine', statusCode: 0 },
  { lat: -34.9011, lng: 18.4235, heading: 200, course: 198, speed: 15.7, status: 'Under Way Using Engine', statusCode: 0 }
]

function randomJitter(value, range) {
  return value + (Math.random() - 0.5) * range * 2
}

export function generateVessels(count = 200) {
  const list = []
  for (let i = 0; i < count; i++) {
    const base = BASE_VESSELS[i % BASE_VESSELS.length]
    const pos = BASE_POSITIONS[i % BASE_POSITIONS.length]
    const uniqueId = String(i).padStart(3, '0')
    list.push({
      mmsi: base.mmsi.slice(0, 6) + uniqueId,
      imo: base.imo,
      vesselName: i < BASE_VESSELS.length ? base.vesselName : `${base.vesselName} ${Math.floor(i / BASE_VESSELS.length)}`,
      vesselType: base.vesselType,
      latitude: Math.round(randomJitter(pos.lat, 0.5) * 10000) / 10000,
      longitude: Math.round(randomJitter(pos.lng, 0.5) * 10000) / 10000,
      heading: Math.round(randomJitter(pos.heading, 5)),
      course: Math.round(randomJitter(pos.course, 5)),
      speed: Math.max(0, Math.round(randomJitter(pos.speed, 1.5) * 10) / 10),
      status: pos.status,
      statusCode: pos.statusCode,
      departure: base.departure,
      destination: base.destination,
      eta: base.eta
    })
  }
  return list
}

export function getVesselsResponse() {
  const list = generateVessels(200)
  return {
    total: 12450,
    updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    list
  }
}
