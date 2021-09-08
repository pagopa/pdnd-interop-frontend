import React from 'react'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'

const CONTENTS = [
  {
    title: 'Section 1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis ipsum vel nisl fermentum venenatis. Duis luctus tincidunt molestie. Cras felis dolor, congue consectetur interdum at, rhoncus auctor lacus. In ultrices mollis vehicula. Etiam vel pellentesque nisl. Fusce a felis metus. Sed vehicula egestas arcu, id malesuada purus condimentum in. Quisque lobortis aliquam velit, vitae rhoncus augue. Phasellus consectetur ante eleifend nisi porttitor egestas. Vestibulum fringilla posuere magna eu placerat. Quisque maximus dui arcu, non convallis urna maximus at. Nunc pretium, magna ut fringilla suscipit, ligula dui fermentum elit, vitae mollis turpis ipsum sit amet lorem. Nunc hendrerit nec elit vitae molestie. In suscipit quam porttitor neque pellentesque pharetra ut vel ex.',
  },
  {
    title: 'Section 2',
    text: 'Mauris convallis ipsum sit amet convallis ullamcorper. Quisque tempor sapien blandit, mattis mauris in, maximus nulla. Ut ultricies orci quis leo facilisis, ut malesuada orci pellentesque. Curabitur facilisis vitae mi varius mattis. Vestibulum sagittis urna et blandit consectetur. Curabitur urna diam, sodales a aliquet non, interdum et nisi. Fusce placerat tempus lectus vitae finibus. In viverra enim quis ipsum cursus, vel commodo tellus pellentesque. Donec nulla lacus, congue eget diam nec, semper scelerisque nunc. Nam ac justo mauris. Donec rhoncus sapien neque.',
  },
  {
    title: 'Section 3',
    text: 'Integer porta ex nec est varius, non maximus arcu cursus. Suspendisse sodales urna sed felis accumsan, ac malesuada est elementum. Ut ut iaculis dui, nec gravida felis. Aliquam egestas enim sed ultrices mollis. Nulla tempus elit ac libero tincidunt vestibulum. Etiam posuere, nibh nec faucibus accumsan, nunc neque iaculis purus, non luctus massa ex ut dolor. Quisque laoreet a diam vel egestas. Suspendisse vitae ullamcorper quam. Cras venenatis eu dui ac tincidunt. Sed fermentum elit eget ante malesuada lacinia a in quam. Nam ac gravida arcu.',
  },
  {
    title: 'Section 4',
    text: 'Nunc odio lorem, hendrerit sed justo ac, luctus sollicitudin erat. Donec non neque aliquet, malesuada metus sed, finibus magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum molestie congue ligula in accumsan. Cras ullamcorper finibus felis, pulvinar venenatis metus consequat nec. Ut eget metus congue ipsum pulvinar venenatis. Sed nec nulla dolor. Mauris vitae urna nec urna auctor consectetur non eu nisi. Aliquam vitae metus semper, scelerisque libero ac, malesuada diam. Sed vehicula diam augue, id tincidunt leo pharetra in.',
  },
  {
    title: 'Section 5',
    text: 'Integer vel urna vestibulum, ultrices enim vel, aliquet leo. Etiam id purus dictum lacus cursus vestibulum ac nec est. Nullam aliquet eu nisl vel consectetur. Praesent eleifend leo vitae metus pulvinar imperdiet. Cras ut venenatis lacus. Quisque vitae tellus fringilla, varius quam non, sodales urna. Maecenas fermentum, odio interdum eleifend viverra, neque arcu sollicitudin sapien, in consectetur magna risus sit amet turpis. Ut facilisis, urna nec ultrices elementum, augue mi finibus lorem, vel efficitur tortor dolor tincidunt eros. Vestibulum semper maximus ligula eu maximus. Vestibulum tincidunt dapibus eros at consectetur. Proin ac sem ac est eleifend tristique. Vivamus lobortis, lorem et posuere venenatis, tellus lacus faucibus arcu, ut vulputate neque urna sed metus.',
  },
  {
    title: 'Section 6',
    text: 'Curabitur rutrum mauris ut fermentum ornare. Vivamus at gravida risus. Curabitur et cursus nibh. Nunc tempus vitae lectus a dignissim. Nunc rhoncus lacus lorem, non sodales tellus ornare at. Nulla eget luctus turpis, quis elementum metus. Maecenas molestie molestie urna non rutrum.',
  },
  {
    title: 'Section 7',
    text: 'Nam rhoncus augue at justo rhoncus pellentesque. Fusce bibendum urna sit amet blandit luctus. Nunc porttitor nisi eu neque imperdiet, sed rhoncus mauris ultrices. Aliquam velit sem, mollis at suscipit semper, egestas sed leo. Mauris vel mi et ante volutpat rutrum. Pellentesque mollis a lacus non vestibulum. Mauris nisl tortor, mattis nec eros nec, bibendum maximus tortor. Aenean lobortis commodo elit. Vivamus sed neque luctus, accumsan augue viverra, laoreet leo. Vestibulum at risus leo. Nulla et erat lorem. Vivamus lacinia eros leo, nec aliquam leo dictum at. Proin at nisi ac lacus faucibus pharetra id eu justo. Sed vestibulum nunc sed diam sodales, vitae mattis metus porttitor. Pellentesque blandit eget ex at dapibus. Aenean dapibus mauris sem, malesuada blandit lorem malesuada eu.',
  },
]

export function Help() {
  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Pagina di supporto',
          description:
            'In questa pagina puoi trovare tutti i riferimenti necessari alla risoluzione dei problemi',
        }}
      </StyledIntro>
      {CONTENTS.map(({ title, text }, i) => (
        <div key={i}>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </WhiteBackground>
  )
}
