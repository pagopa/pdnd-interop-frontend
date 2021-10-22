import React from 'react'
import { Layout } from '../components/Shared/Layout'
import { StyledIntro } from '../components/Shared/StyledIntro'

const CONTENTS = [
  {
    title: 'Guida step 1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis ipsum vel nisl fermentum venenatis. Duis luctus tincidunt molestie. Cras felis dolor, congue consectetur interdum at, rhoncus auctor lacus. In ultrices mollis vehicula. Etiam vel pellentesque nisl. Fusce a felis metus. Sed vehicula egestas arcu, id malesuada purus condimentum in. Quisque lobortis aliquam velit, vitae rhoncus augue. Phasellus consectetur ante eleifend nisi porttitor egestas. Vestibulum fringilla posuere magna eu placerat. Quisque maximus dui arcu, non convallis urna maximus at. Nunc pretium, magna ut fringilla suscipit, ligula dui fermentum elit, vitae mollis turpis ipsum sit amet lorem. Nunc hendrerit nec elit vitae molestie. In suscipit quam porttitor neque pellentesque pharetra ut vel ex.',
  },
  {
    title: 'Guida step 2',
    text: 'Mauris convallis ipsum sit amet convallis ullamcorper. Quisque tempor sapien blandit, mattis mauris in, maximus nulla. Ut ultricies orci quis leo facilisis, ut malesuada orci pellentesque. Curabitur facilisis vitae mi varius mattis. Vestibulum sagittis urna et blandit consectetur. Curabitur urna diam, sodales a aliquet non, interdum et nisi. Fusce placerat tempus lectus vitae finibus. In viverra enim quis ipsum cursus, vel commodo tellus pellentesque. Donec nulla lacus, congue eget diam nec, semper scelerisque nunc. Nam ac justo mauris. Donec rhoncus sapien neque.',
  },
  {
    title: 'Guida step 3',
    text: 'Integer porta ex nec est varius, non maximus arcu cursus. Suspendisse sodales urna sed felis accumsan, ac malesuada est elementum. Ut ut iaculis dui, nec gravida felis. Aliquam egestas enim sed ultrices mollis. Nulla tempus elit ac libero tincidunt vestibulum. Etiam posuere, nibh nec faucibus accumsan, nunc neque iaculis purus, non luctus massa ex ut dolor. Quisque laoreet a diam vel egestas. Suspendisse vitae ullamcorper quam. Cras venenatis eu dui ac tincidunt. Sed fermentum elit eget ante malesuada lacinia a in quam. Nam ac gravida arcu.',
  },
  {
    title: 'Guida step 4',
    text: 'Nunc odio lorem, hendrerit sed justo ac, luctus sollicitudin erat. Donec non neque aliquet, malesuada metus sed, finibus magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum molestie congue ligula in accumsan. Cras ullamcorper finibus felis, pulvinar venenatis metus consequat nec. Ut eget metus congue ipsum pulvinar venenatis. Sed nec nulla dolor. Mauris vitae urna nec urna auctor consectetur non eu nisi. Aliquam vitae metus semper, scelerisque libero ac, malesuada diam. Sed vehicula diam augue, id tincidunt leo pharetra in.',
  },
]

export function IPAGuide() {
  return (
    <Layout>
      <StyledIntro>
        {{
          title: 'Accreditarsi su IPA',
          description:
            'La tua organizzazione non è su IPA? Nessun problema, segui la guida per accreditarti',
        }}
      </StyledIntro>
      {CONTENTS.map(({ title, text }, i) => (
        <div key={i}>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </Layout>
  )
}
