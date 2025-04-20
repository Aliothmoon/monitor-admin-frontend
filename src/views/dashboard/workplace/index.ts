export function getMonitorStats() {
  return Promise.resolve({
    data: {
      activeExams: 3,
      totalExams: 5,
      anomalies: 5,
      pendingAnomalies: 3,
      onlineProctors: 12,
      totalProctors: 20,
      onlineCandidates: 150,
      recentAnomalies: [
        { 
          time: '10:15', 
          type: '作弊行为', 
          description: '考生张某疑似使用手机', 
          resolved: false 
        },
        { 
          time: '10:08', 
          type: '网络中断', 
          description: '考生李某网络连接中断45秒', 
          resolved: true 
        },
        { 
          time: '09:56', 
          type: '设备异常', 
          description: '考生王某摄像头异常', 
          resolved: false 
        }
      ]
    }
  });
}

export function getExamSchedule() {
  return Promise.resolve({
    data: [
      { 
        name: '2021-数据结构',
        status: '进行中', 
        time: '09:00-11:00', 
        duration: 120, 
        proctor: '王教授', 
        candidateCount: 48 
      },
      { 
        name: '2021-算法实现',
        status: '即将开始', 
        time: '13:30-15:30', 
        duration: 120, 
        proctor: '李教授', 
        candidateCount: 60 
      },
      { 
        name: '计算机网络原理', 
        status: '已结束', 
        time: '08:00-10:00', 
        duration: 120, 
        proctor: '张教授', 
        candidateCount: 42 
      },
      { 
        name: '数据结构与算法', 
        status: '即将开始', 
        time: '14:00-16:00', 
        duration: 120, 
        proctor: '赵教授', 
        candidateCount: 35 
      },
      { 
        name: '操作系统原理', 
        status: '已排期', 
        time: '明天 10:00-12:00', 
        duration: 120, 
        proctor: '孙教授', 
        candidateCount: 53 
      }
    ]
  });
}

export function getSystemNotifications() {
  return Promise.resolve({
    data: [
      { 
        title: '系统更新通知', 
        content: '系统将于今晚22:00-23:00进行维护更新，请合理安排考试时间', 
        time: '10分钟前' 
      },
      { 
        title: '考试异常警报', 
        content: '计算机网络原理考试中有3名学生出现异常行为，请及时处理', 
        time: '30分钟前' 
      },
      { 
        title: '监考培训通知', 
        content: '新版本在线监考系统培训将于本周五下午举行，请准时参加', 
        time: '2小时前' 
      },
      {
        title: '考试变更通知',
        content: '数据库原理考试因特殊情况延期至下周三进行，请各位监考老师注意时间调整',
        time: '昨天'
      },
      {
        title: '反作弊系统升级',
        content: '系统已更新最新的AI识别算法，可更精确地识别考生的异常行为',
        time: '2天前'
      }
    ]
  });
}

export function getCandidateLiveData() {
  return Promise.resolve({
    data: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `考生${i + 1}`,
      status: i === 2 ? '异常' : '正常',
      hasAnomaly: i === 2,
      anomalyType: i === 2 ? '可疑行为' : null,
      cameraStatus: i === 4 ? '断线' : '正常'
    }))
  });
}