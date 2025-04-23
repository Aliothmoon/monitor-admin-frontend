import { ref } from "vue";
import dayjs from "dayjs";

// 模拟数据
export const examList = ref([
  { id: 1, name: "模拟考试A" },
  { id: 2, name: "模拟考试B" },
]);

export const proctorList = ref([
  { id: 101, name: "张老师" },
  { id: 102, name: "李老师" },
]);

export const fetchData = async (page = 1, pageSize = 10, key?: string) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const mockData = Array.from({ length: 35 }).map((_, index) => ({
    id: index + 1,
    roomName: `考场 ${index + 1}`,
    examId: (index % 2) + 1,
    proctorId: (index % 2) + 101,
    capacity: Math.floor(Math.random() * 50) + 20,
    location: `教学楼 ${Math.floor(index / 10) + 1}0${(index % 10) + 1}`,
    startTime: dayjs().add(index, "day").subtract(5, "hour").toISOString(),
    endTime: dayjs().add(index, "day").add(2, "hour").toISOString(),
    status: index % 3,
  }));
  return {
    list: mockData,
    total: mockData.length,
  };
};
