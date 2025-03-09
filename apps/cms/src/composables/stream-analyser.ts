export function parseSSEData(data: string): any[] {
  const lines = data.split('\n\n');

  // 把lines进行聚合 具体规则如下：
  // 如果当前这一行是data:就新开一个数组 否则就都加到全来的数组里
  const aggregatedLines = lines.reduce((acc, line) => {
    if (line.startsWith('data:')) {
      acc.push(line.substring(5));
    } else {
      acc[acc.length - 1] += line;
    }
    return acc;
  }, [] as string[]);

  return aggregatedLines.map(item => {
    try {
      return JSON.parse(item)
    } catch (e) {
      return null
    }
  }).filter(item => item !== null).flat();

  // let lastContent = ''

  // return lines.map(line => {
  //   if (line.startsWith('data:')) {
  //     const eventData = line.substring(5);

  //     console.log(eventData)

  //     try {
  //       const obj = JSON.parse(lastContent + eventData);

  //       console.log({ obj })

  //       lastContent = ''

  //       return obj

  //     } catch (e) {
  //       lastContent = eventData
  //       return null
  //     }
  //   }
  //   return null; // 如果不是data: 开头，返回null
  // }).filter(eventData => eventData !== null);
}

export async function fetchSSEData(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch SSE data: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Failed to get response body reader');
  }

  try {
    for await (const chunk of reader) {
      const data = decoder.decode(chunk, { stream: true });
      const lines = data.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const eventData = line.substring(5);
          try {
            const obj = JSON.parse(eventData);
            console.log({ obj });
            // 在这里可以处理解析后的对象
          } catch (e) {
            console.error('Failed to parse JSON:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading stream:', error);
  } finally {
    reader.releaseLock();
  }
}
