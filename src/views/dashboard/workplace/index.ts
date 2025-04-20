export function getMonitorStats() {
  return Promise.resolve({
    data: {
      activeExams: 3,
      anomalies: 5,
      onlineProctors: 12,
      totalProctors: 20,
      onlineCandidates: 150
    }
  });
}