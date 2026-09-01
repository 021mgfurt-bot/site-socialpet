import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { DeviceMockup } from "../components/ui/DeviceMockup";
import { ProductVideo } from "../components/media/ProductVideo";
import { MockupPlaceholder } from "../components/media/MockupPlaceholder";
import { TODAY_OCCURRENCES, REMINDER_DEMO_RECORDS } from "../data/reminderDemoRecords";
import {
  sortTodayOccurrences,
  formatTime,
  getTodayLabel,
  describeWeekdays,
  nextWeekdayLabel,
} from "../lib/reminderCalculations";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playAgendaEntrance, playAgendaCompletion } from "../motion/agendaTimeline";
import { gsap } from "../motion/gsap";
import { cx } from "../lib/classNames";
import styles from "./Agenda.module.css";

const RECURRING_CARE = REMINDER_DEMO_RECORDS.find((r) => r.id === "cuidado-thor-banho")!;
const NEXT_APPOINTMENT = REMINDER_DEMO_RECORDS.find((r) => r.id === "consulta-mel")!;

/**
 * Campos, tipos, limite de horários e opções de recorrência confirmados
 * em legacy/app.js/index.html (Prompt 9 §3-4) — não vindos só da
 * auditoria anterior. Notificações: confirmado (de novo, no Prompt 9.5)
 * que só existe aviso local (setInterval/setTimeout na aba aberta),
 * nenhum envio push server-side existe no repositório. Por isso a copy
 * não promete nem menciona aviso automático — não há nada digno de
 * destaque comercial em "avisar só com o app aberto" (Prompt 9.5 §10/§13).
 */
export function Agenda() {
  const reducedMotion = useReducedMotion();

  const railRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLLIElement | null)[]>([]);
  const recurrenceRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const firstDoneMarkerRef = useRef<HTMLSpanElement>(null);
  const firstDoneLabelRef = useRef<HTMLSpanElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const todayEvents = sortTodayOccurrences(TODAY_OCCURRENCES);
  const firstDoneIndex = todayEvents.findIndex((event) => event.done);

  useEffect(() => {
    const todayEventEls = eventRefs.current.filter((el): el is HTMLLIElement => Boolean(el));

    if (reducedMotion) {
      gsap.set(
        [
          railFillRef.current,
          ...todayEventEls,
          recurrenceRef.current,
          nextRef.current,
          phoneRef.current,
        ].filter(Boolean),
        { opacity: 1, x: 0, y: 0, scale: 1 },
      );
      if (railFillRef.current) gsap.set(railFillRef.current, { scaleY: 1 });
      if (firstDoneMarkerRef.current) gsap.set(firstDoneMarkerRef.current, { scale: 1, opacity: 1 });
      if (firstDoneLabelRef.current) gsap.set(firstDoneLabelRef.current, { opacity: 1, x: 0 });
      return;
    }

    const cleanupEntrance = playAgendaEntrance({
      rail: railRef.current,
      railFill: railFillRef.current,
      todayEvents: todayEventEls,
      recurrence: recurrenceRef.current,
      next: nextRef.current,
      phone: phoneRef.current,
    });

    const cleanupCompletion = playAgendaCompletion({
      marker: firstDoneMarkerRef.current,
      label: firstDoneLabelRef.current,
    });

    return () => {
      cleanupEntrance();
      cleanupCompletion();
    };
  }, [reducedMotion]);

  return (
    <Section id="agenda" tone="paper" ariaLabel="Agenda e lembretes">
      <Container>
        <div className={styles.layout}>
          <div className={styles.stickyText}>
            <h2 className={styles.headline}>Consulta na sexta. Remédio às 8h. E amanhã de novo.</h2>
            <p className={styles.copy}>
              Cada lembrete fica com o pet certo, no tipo certo (remédio, consulta ou outro cuidado) e no
              horário definido. Quando se repete todo dia ou em dias específicos da semana, a rotina já
              nasce organizada, e dá pra acompanhar o que já foi feito.
            </p>
          </div>

          <div className={styles.content}>
            <div ref={railRef} className={styles.railWrap}>
              <div className={styles.railTrack} aria-hidden="true">
                <div ref={railFillRef} className={styles.railFill} />
              </div>

              <span className={styles.todayLabel}>{getTodayLabel()}</span>

              <p className="visually-hidden">Lembretes de hoje, em ordem de horário:</p>
              <ul className={styles.eventList}>
                {todayEvents.map((event, index) => (
                  <li
                    key={event.id}
                    ref={(el) => {
                      eventRefs.current[index] = el;
                    }}
                    className={styles.event}
                  >
                    <span
                      ref={index === firstDoneIndex ? firstDoneMarkerRef : undefined}
                      className={cx(styles.eventMarker, event.done && styles.eventMarkerDone)}
                      aria-hidden="true"
                    />
                    <div className={styles.eventBody}>
                      <span className={styles.eventTime}>{formatTime(event.time)}</span>
                      <span className={styles.eventTitle}>
                        {event.title} <span className={styles.eventPet}>· {event.pet}</span>
                      </span>
                      <span
                        ref={index === firstDoneIndex ? firstDoneLabelRef : undefined}
                        className={cx(styles.eventStatus, event.done && styles.eventStatusDone)}
                      >
                        {event.done ? "Feito" : "Pendente"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div ref={recurrenceRef} className={styles.recurrenceBlock}>
              <span className={styles.blockEyebrow}>Quando se repete</span>
              <p className={styles.recurrenceText}>
                {RECURRING_CARE.title} <span className={styles.eventPet}>· {RECURRING_CARE.pet}</span>,
                toda {describeWeekdays(RECURRING_CARE.weekdays ?? [])}
              </p>
              <div className={styles.echoRow} aria-hidden="true">
                <span className={styles.echoDot} />
                <span className={styles.echoLine} />
                <span className={styles.echoDot} />
              </div>
            </div>

            <div ref={nextRef} className={styles.nextBlock}>
              <span className={styles.blockEyebrow}>Próximo compromisso</span>
              <p className={styles.nextTitle}>
                {NEXT_APPOINTMENT.title} <span className={styles.eventPet}>· {NEXT_APPOINTMENT.pet}</span>
              </p>
              <p className={styles.nextWhen}>
                {nextWeekdayLabel(5)} · {formatTime(NEXT_APPOINTMENT.times[0])}
              </p>
            </div>

            <div ref={phoneRef} className={styles.phoneBlock}>
              <DeviceMockup
                label="Tela real da agenda do SocialPet, na conta de demonstração"
                className={styles.phoneMockup}
              >
                <ProductVideo poster="/product-demos/agenda/agenda-screen-mobile.png" fallback={<MockupPlaceholder />} />
              </DeviceMockup>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
