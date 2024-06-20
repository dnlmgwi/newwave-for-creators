<script lang="ts">
  import * as HoverCard from "../ui/hover-card";

  export let id: string;
  export let name: string;
</script>

<HoverCard.Root>
  <HoverCard.Trigger>{id}</HoverCard.Trigger>
  <HoverCard.Content>
    {name}
  </HoverCard.Content>
</HoverCard.Root>
